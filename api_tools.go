package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os/exec"
	"reflect"
	"sort"
	"strings"

	"github.com/gorilla/mux"
)

func updateContacts(w http.ResponseWriter, r *http.Request) {
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

	dbContacts := listDBcontacts(database, id[len(id)-1])

	toDelete, toAdd := checkRealExistingContacts(joined, dbContacts)

	if len(toDelete) != 0 {
		deleteContacts(database, toDelete, id[len(id)-1])
	}

	if len(toAdd) != 0 {
		addContacts(database, toAdd, id[len(id)-1])
	}

	var res contactsUpdateResult

	if len(toAdd) != 0 || len(toDelete) != 0 {
		res.Contacts = joined
		res.Updated = true
		json.NewEncoder(w).Encode(res)

		return
	}

	res.Updated = false
	json.NewEncoder(w).Encode(res)
}

func checkRealExistingContacts(fromCell [][]string, dbContacts [][]string) ([][]string, [][]string) {
	var toDeleteToDB [][]string
	var toAddToDB [][]string

	for _, c := range dbContacts {
		if !in_slice_apps(c, fromCell) && !in_slice_apps(c, toDeleteToDB) {
			toDeleteToDB = append(toDeleteToDB, c)
		}
	}

	for _, c := range fromCell {
		if !in_slice_apps(c, dbContacts) && !in_slice_apps(c, toAddToDB) {
			toAddToDB = append(toAddToDB, c)
		}
	}

	return toDeleteToDB, toAddToDB
}

func in_slice_apps(n []string, h [][]string) bool {
	for _, v := range h {
		if reflect.DeepEqual(v, n) {
			return true
		}
	}
	return false
}

type contactsUpdateResult struct {
	Contacts [][]string `json:"contacts"`
	Updated  bool       `json:"updated"`
}

func listContacts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json; charset=utf-8")

	id := strings.Fields(mux.Vars(r)["id"])

	contacts := listDBcontacts(database, id[len(id)-1])
	json.NewEncoder(w).Encode(contacts)
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

	messages := listDBmessages(database, id[len(id)-1])

	var dbMessage []Messages

	for _, m := range messages {
		dbMessage = append(dbMessage, Messages{
			Phone:    m[0],
			Messages: []string{m[1]},
			Inbox:    []bool{m[2] == "1"},
			Date:     []string{m[3]},
		})
	}

	dbMessage = joinMessages(dbMessage)

	json.NewEncoder(w).Encode(dbMessage)
}

func updateMessages(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json; charset=utf-8")

	id := strings.Fields(mux.Vars(r)["id"])

	command := fmt.Sprintf("-s %s shell content query --uri content://sms/inbox --projection address:body:date", id[len(id)-1])
	cmd := exec.Command("adb", strings.Fields(command)...)
	stdout, _ := cmd.Output()

	lines := strings.Split(strings.ReplaceAll(string(stdout), "\r", ""), "\n")
	lines = delete_empty(lines)

	savedLines := joinLines(lines)
	inboxMessages := getMessages(savedLines, true)

	command = fmt.Sprintf("-s %s shell content query --uri content://sms/sent --projection address:body:date", id[len(id)-1])
	cmd = exec.Command("adb", strings.Fields(command)...)
	stdout, _ = cmd.Output()

	lines = strings.Split(strings.ReplaceAll(string(stdout), "\r", ""), "\n")
	lines = delete_empty(lines)

	savedLines = joinLines(lines)

	sentMessages := getMessages(savedLines, false)

	fullMessages := inboxMessages
	fullMessages = append(fullMessages, sentMessages...)

	joined := joinMessages(fullMessages)

	var dbMessage []Messages

	for _, m := range listDBmessages(database, id[len(id)-1]) {
		dbMessage = append(dbMessage, Messages{
			Phone:    m[0],
			Messages: []string{m[1]},
			Inbox:    []bool{m[2] == "1"},
			Date:     []string{m[3]},
		})
	}

	var res messagesUpdateResult

	if len(dbMessage) == 0 {
		addMessages(database, joined, id[len(id)-1])

		res.Msgs = joined
		res.Updated = true

		json.NewEncoder(w).Encode(res)
		return
	}

	dbMessage = joinMessages(dbMessage)

	toDelete, toAdd := checkRealExistingMessages(dbMessage, joined)

	if len(toDelete) != 0 {
		deleteMessages(database, toDelete, id[len(id)-1])
	}

	if len(toAdd) != 0 {
		addMessages(database, toAdd, id[len(id)-1])
	}

	if len(toAdd) != 0 || len(toDelete) != 0 {
		res.Msgs = joined
		res.Updated = true

		json.NewEncoder(w).Encode(res)
		return
	}

	json.NewEncoder(w).Encode(res)
}

type messagesUpdateResult struct {
	Msgs    []Messages `json:"messages"`
	Updated bool       `json:"updated"`
}

func checkRealExistingMessages(db []Messages, phone []Messages) ([]Messages, []Messages) {
	var toDelete []Messages
	var toAdd []Messages

	for _, c := range db {
		if !in_slice_messages(c, phone) && !in_slice_messages(c, toDelete) {
			toDelete = append(toDelete, c)
		}
	}

	for _, c := range phone {
		if !in_slice_messages(c, db) && !in_slice_messages(c, toAdd) {
			toAdd = append(toAdd, c)
		}
	}

	return toDelete, toAdd
}

func in_slice_messages(n Messages, h []Messages) bool {
	for _, v := range h {
		if reflect.DeepEqual(v, n) {
			return true
		}
	}
	return false
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
	}

	return joined
}

type messageInbox struct {
	message string
	inbox   bool
	date    string
}

type sendMsg struct {
	Phone   string `json:"phone"`
	Message string `json:"message"`
	Serial  string `json:"serial"`
	Code    string `json:"code"`
}

func sendMessage(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json; charset=utf-8")

	reqBody, _ := io.ReadAll(r.Body)

	var msg sendMsg
	json.Unmarshal([]byte(string(reqBody)), &msg)

	//  service call isms 5 i32 0 s16 "com.android.mms.service" s16 "null" s16 "+5352184805" s16 "null" s16 "prueba" s16 "null" s16 "null" i32 0 i64 0

	var res sendMessageResponse
	res.Sended = true

	// command := fmt.Sprintf(`-s %s shell dumpsys window`, msg.Serial)
	// stdout := executeAdbCommand(command)

	// lines := strings.Split(stdout, "\n")

	// if checkLockScreen(lines) {
	// 	res.Sended = false
	// 	res.ErrorSending = "locked"
	// 	json.NewEncoder(w).Encode(res)
	// 	return
	// }

	command := fmt.Sprintf(`-s %s shell service call isms 5 i32 0 s16 "com.android.mms.service" s16 "null" s16 "%s" s16 "null" s16 "%s" s16 "null" s16 "null" i32 0 i64 0`, msg.Serial, msg.Phone, msg.Message)

	// executeAdbCommand(command)

	json.NewEncoder(w).Encode(command)
}

func checkLockScreen(lines []string) bool {
	lock := ""

	for _, l := range lines {
		if strings.Contains(l, "mDreamingLockscreen") {
			lock = strings.Fields(l)[1]
			break
		}
	}

	return strings.Split(lock, "=")[1] == "true"
}

func executeAdbCommand(command string) string {
	cmd := exec.Command("adb", strings.Fields(command)...)
	stdout, _ := cmd.Output()

	return string(stdout)
}

type sendMessageResponse struct {
	Sended       bool   `json:"sended"`
	ErrorSending string `json:"error"`
}
