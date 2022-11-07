package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os/exec"
	"sort"
	"strings"

	"github.com/gorilla/mux"
)

func listContacts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json; charset=utf-8")

	id := strings.Fields(mux.Vars(r)["id"])

	command := fmt.Sprintf("-s %s shell content query --uri content://contacts/phones/ --projection display_name:number", id[len(id)-1])
	cmd := exec.Command("adb", strings.Fields(command)...)
	stdout, _ := cmd.Output()

	lines := strings.Split(strings.ReplaceAll(string(stdout), "\r", ""), "\n")[1:]
	lines = delete_empty(lines)

	var contacts [][]string

	for _, l := range lines {
		l = strings.Join(strings.Fields(l)[2:], " ")

		display_name := strings.Index(l, "display_name") + 13
		number := strings.Index(l, ", number=")

		contacts = append(contacts, []string{
			l[display_name:number],
			l[number+9:],
		})
	}

	var joined [][]string

	for _, contact := range contacts {
		flag := false
		count := 0
		for i, c := range joined {
			if contact[0] == c[0] {
				flag = true
				count = i
				break
			}
		}

		if flag {
			joined[count] = append(joined[count], contact[1])
			continue
		}
		joined = append(joined, contact)
	}

	sort.Slice(joined, func(i, j int) bool {
		name1 := joined[i][0]
		name2 := joined[j][0]

		return name1 < name2
	})

	json.NewEncoder(w).Encode(joined)
}

type Messages struct {
	Phone    string   `json:"phone"`
	Messages []string `json:"messages"`
	Date     []string `json:"date"`
	Inbox    []bool   `json:"inbox"`
}

func listMessages(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json; charset=utf-8")

	id := strings.Fields(mux.Vars(r)["id"])

	command := fmt.Sprintf("-s %s shell content query --uri content://sms/inbox --projection address:body:date", id[len(id)-1])
	cmd := exec.Command("adb", strings.Fields(command)...)
	stdout, _ := cmd.Output()

	lines := strings.Split(strings.ReplaceAll(string(stdout), "\r", ""), "\n")[1:]
	lines = delete_empty(lines)

	savedLines := joinLines(lines)
	inboxMessages := getMessages(savedLines, true)

	command = fmt.Sprintf("-s %s shell content query --uri content://sms/sent --projection address:body:date", id[len(id)-1])
	cmd = exec.Command("adb", strings.Fields(command)...)
	stdout, _ = cmd.Output()

	lines = strings.Split(strings.ReplaceAll(string(stdout), "\r", ""), "\n")[1:]
	lines = delete_empty(lines)

	savedLines = joinLines(lines)

	sentMessages := getMessages(savedLines, false)

	fullMessages := inboxMessages
	fullMessages = append(fullMessages, sentMessages...)

	joined := joinMessages(fullMessages)

	json.NewEncoder(w).Encode(joined)
}

func joinLines(lines []string) []string {
	var savedLines []string
	newLine := ""
	new := true
	for _, l := range lines {
		if strings.HasPrefix(l, "Row:") && new {
			newLine += l
			new = false
			continue
		}

		if strings.HasPrefix(l, "Row:") && !new {
			savedLines = append(savedLines, newLine)
			newLine = l
			// new = true
			continue
		}

		newLine += l
	}

	return savedLines
}

func getMessages(savedLines []string, inbox bool) []Messages {
	var messages []Messages
	for _, l := range savedLines {
		l = strings.Join(strings.Fields(l)[2:], " ")

		address := strings.Index(l, "address=") + 8
		body := strings.Index(l, ", body=")
		date := strings.Index(l, ", date=")

		messages = append(messages, Messages{
			Phone: l[address:body],
			Messages: []string{
				l[body+7 : date],
			},
			Date: []string{
				l[date+7:],
			},
			Inbox: []bool{inbox},
		})
	}

	return messages
}

func joinMessages(messages []Messages) []Messages {
	var joined []Messages
	for _, message := range messages {
		flag := false
		count := 0
		for i, c := range joined {
			if message.Phone == c.Phone {
				flag = true
				count = i
				break
			}
		}

		if flag {
			joined[count].Messages = append(joined[count].Messages, message.Messages...)
			joined[count].Date = append(joined[count].Date, message.Date...)
			joined[count].Inbox = append(joined[count].Inbox, message.Inbox...)
			continue
		}
		joined = append(joined, message)
	}

	sort.Slice(joined, func(i, j int) bool {
		name1 := joined[i].Phone
		name2 := joined[j].Phone

		return name1 < name2
	})

	for i, m := range joined {
		if len(m.Messages) == 1 {
			continue
		}

		messages := m.Messages
		inbox := m.Inbox
		dates := m.Date

		var messagesAndInbox []messageInbox

		for i, mm := range messages {
			messagesAndInbox = append(messagesAndInbox, messageInbox{
				message: mm,
				inbox:   inbox[i],
				date:    dates[i],
			})
		}

		sort.Slice(messagesAndInbox, func(i, j int) bool {
			name1 := messagesAndInbox[i].date
			name2 := messagesAndInbox[j].date

			return name1 < name2
		})

		m.Messages = []string{}
		m.Date = []string{}
		m.Inbox = []bool{}

		for _, mm := range messagesAndInbox {
			m.Messages = append(m.Messages, mm.message)
			m.Inbox = append(m.Inbox, mm.inbox)
			m.Date = append(m.Date, mm.date)
		}

		joined[i].Messages = m.Messages
		joined[i].Inbox = m.Inbox
		joined[i].Date = m.Date

		fmt.Println()
	}

	return joined
}

type messageInbox struct {
	message string
	inbox   bool
	date    string
}
