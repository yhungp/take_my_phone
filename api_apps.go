package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os/exec"
	"reflect"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/mux"
)

func executeCommand(app string, rest_off_command string) string {
	out := ""

	cmd := exec.Command(app, strings.Fields(rest_off_command)...)
	stdout, _ := cmd.Output()

	out = strings.ReplaceAll(string(stdout), "\n", "")
	out = strings.ReplaceAll(string(out), "\r", "")

	return out
}

func getSpecificSize(space_type string, lines []string, app_indexes map[string]int) map[string]string {
	sizes := make(map[string]string, 0)

	for _, l := range lines {
		if strings.Contains(l, space_type) {
			l = strings.ReplaceAll(l, space_type+" [", "")
			l = strings.ReplaceAll(l, "]", "")

			spaces := strings.Split(l, ",")

			for k, element := range app_indexes {
				size_str := spaces[element]
				_, err := strconv.Atoi(size_str)

				if err != nil {
					sizes[k] = "0"
				} else {
					sizes[k] = size_str
				}
			}
		}
	}

	return sizes
}

func getIndexesOfApps(third_party_apps []string, console_output []string) map[string]int {
	indexes := make(map[string]int)
	var all_apps []string

	for _, l := range console_output {
		if strings.Contains(l, "Package Names:") {
			l = strings.ReplaceAll(l, "Package Names: [", "")
			l = strings.ReplaceAll(l, "]", "")
			l = strings.ReplaceAll(l, "\"", "")

			all_apps = strings.Split(l, ",")
			break
		}
	}

	for i, app := range all_apps {
		for _, app_3rd := range third_party_apps {
			if app_3rd == app {
				indexes[app] = i
				break
			}
		}
	}

	return indexes
}

func removeDuplicatesAppsOnDB(apps [][]string) [][]string {
	var notRepeated [][]string

	if len(apps) == 0 {
		return notRepeated
	}

	for i, app := range apps[0] {
		flag := false

		if len(notRepeated) == 0 {
			notRepeated = [][]string{
				{apps[0][i]},
				{apps[1][i]},
				{apps[2][i]},
				{apps[3][i]},
				{apps[4][i]},
				{apps[5][i]},
			}
			continue
		}

		for _, notRep := range notRepeated[0] {
			if reflect.DeepEqual(app, notRep) {
				flag = true
				break
			}
		}

		if !flag {
			notRepeated[0] = append(notRepeated[0], apps[0][i])
			notRepeated[1] = append(notRepeated[1], apps[1][i])
			notRepeated[2] = append(notRepeated[2], apps[2][i])
			notRepeated[3] = append(notRepeated[3], apps[3][i])
			notRepeated[4] = append(notRepeated[4], apps[4][i])
			notRepeated[5] = append(notRepeated[5], apps[5][i])
		}
	}

	return notRepeated
}

var appNames [][]string

func deviceApps(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	serial_id := mux.Vars(r)["id"]

	appsOnDB := listAppsByDevice(database, serial_id)
	appsOnDB = removeDuplicatesAppsOnDB(appsOnDB)

	// Copy aapt-arm-pie to phone
	copy_cmd := fmt.Sprintf("-s %s push F:/Proyectos/Go/take_my_phone/files/aapt-arm-pie /data/local/tmp", serial_id)
	cmd := exec.Command("adb", strings.Fields(copy_cmd)...)
	cmd.Output()

	set_permission := fmt.Sprintf("-s %s shell chmod 0755 /data/local/tmp/aapt-arm-pie", serial_id)
	cmd = exec.Command("adb", strings.Fields(set_permission)...)
	cmd.Output()

	// Get diskstats
	cmd = exec.Command("adb", "-s", serial_id, "shell", "dumpsys", "diskstats")
	stdout, _ := cmd.Output()

	out := strings.ReplaceAll(string(stdout), "\r", "")
	splitted_diskstats_out := strings.Split(out, "\n")

	// List apps
	cmd = exec.Command("adb", "-s", serial_id, "shell", "cmd package list packages -3")
	stdout, err := cmd.Output()

	if err != nil {
		json.NewEncoder(w).Encode(string(err.Error()))
	}

	out = strings.ReplaceAll(string(stdout), "\r", "")

	var third_party_apps = strings.Split(out, "\n")
	third_party_apps = delete_empty(third_party_apps)
	// third_party_apps = third_party_apps[:5]

	sort.Strings(third_party_apps)

	appNames := make([][]string, 0, len(third_party_apps))

	for i, s := range third_party_apps {
		third_party_apps[i] = s[8:]
	}

	if len(appsOnDB) > 1 {
		third_party_apps, appNames = checkAppsExist(third_party_apps, appsOnDB, serial_id)
	}

	sort.Strings(third_party_apps)

	indexes := getIndexesOfApps(third_party_apps, splitted_diskstats_out)

	// get specific size types
	appSizes := getSpecificSize("App Sizes:", splitted_diskstats_out, indexes)
	dataSizes := getSpecificSize("App Data Sizes:", splitted_diskstats_out, indexes)
	cacheSizes := getSpecificSize("Cache Sizes:", splitted_diskstats_out, indexes)

	to_process = [][]string{}

	b := make(chan bool, len(to_process))
	for i, app := range third_party_apps {
		to_process = append(to_process, []string{""})
		go processThirdPartyApps(
			i,
			app,
			serial_id,
			appSizes[third_party_apps[i]],
			dataSizes[third_party_apps[i]],
			cacheSizes[third_party_apps[i]],
			b,
		)
	}

	for {
		counter := 0

		for _, proc := range to_process {
			if proc[0] != "" {
				counter += 1
			}
		}

		if counter == len(to_process) {
			break
		}

		time.Sleep(time.Millisecond * 500)
	}

	for _, proc := range to_process {
		appNames = append(appNames, proc[1:])
	}

	if len(third_party_apps) != 0 {
		index := getDeviceIndex(database, serial_id)
		addApps(database, appNames, fmt.Sprintf("%d", index))
	}

	sort.Slice(appNames, func(i, j int) bool {
		name1 := appNames[i][1]
		name2 := appNames[j][1]

		return name1 < name2
	})

	json.NewEncoder(w).Encode(appNames)
}

func processThirdPartyApps(i int, app string, serial_id string, app_size string, data_size string, cache_size string, b chan bool) {
	cmd := exec.Command("adb", "-s", serial_id, "shell", "pm", "path", app)
	stdout, _ := cmd.Output()

	out := strings.ReplaceAll(string(stdout), "\r", "")
	out = strings.Split(out, "\n")[0][8:]

	cmd = exec.Command("adb", "-s", serial_id, "shell", "/data/local/tmp/aapt-arm-pie", "d", "badging", out)
	stdout, _ = cmd.Output()

	version := ""
	name := ""

	replacer := strings.NewReplacer(
		"application-label:'", "",
		"\n", "",
		"\r", "",
		"'", "",
	)

	for _, l := range strings.Split(string(stdout), "\n") {
		if strings.Contains(l, "application-label:") {
			name = replacer.Replace(l)
			break
		} else if strings.Contains(l, "versionName=") {
			index_start := strings.Index(l, "versionName='") + len("versionName='")
			index_end := strings.Index(l[index_start:], "'")
			version = l[index_start : index_start+index_end]
		}
	}

	app_name := app

	if name != "" {
		app_name = name
	}

	to_process[i][0] = "end"
	to_process[i] = append(to_process[i], []string{
		app,
		app_name,
		app_size,
		data_size,
		cache_size,
		version,
	}...)

	b <- true
}

func checkAppsExist(third_party_apps []string, appsOnDB [][]string, serial string) ([]string, [][]string) {
	var notExisting []string
	var existing_apps [][]string

	to_process = [][]string{}

	for _, app := range third_party_apps {
		flag_exist := false

		for _, a := range appsOnDB[0] {
			if app == a {
				flag_exist = true
				break
			}
		}

		if !flag_exist {
			notExisting = append(notExisting, app)
			continue
		}

		to_process = append(to_process, []string{app, ""})
	}

	b := make(chan bool, len(to_process))
	for i, proc := range to_process {
		go f(i, serial, proc[0], appsOnDB, b)
	}

	for {
		counter := 0

		for _, proc := range to_process {
			if proc[1] != "" {
				counter += 1
			}
		}

		if counter == len(to_process) {
			break
		}

		time.Sleep(time.Millisecond * 500)
	}

	for _, proc := range to_process {
		if proc[1] == "false" {
			notExisting = append(notExisting, proc[0])
			continue
		}

		for i, a := range appsOnDB[0] {
			if proc[0] == a {
				existing_apps = append(existing_apps, []string{
					appsOnDB[0][i],
					appsOnDB[1][i],
					appsOnDB[2][i],
					appsOnDB[3][i],
					appsOnDB[4][i],
					appsOnDB[5][i],
				})
				break
			}
		}
	}

	return notExisting, existing_apps
}

var to_process [][]string

func f(n int, serial string, app string, appsOnDB [][]string, b chan bool) {
	copy_cmd := fmt.Sprintf(`-s %s shell dumpsys package %s`, serial, app)
	cmd := exec.Command("adb", strings.Fields(copy_cmd)...)
	stdout, _ := cmd.Output()
	lines := strings.Split(string(stdout), "\n")
	version_exist := false

	for _, l := range lines {
		if strings.Contains(l, "versionName") {
			for _, version := range appsOnDB[5] {
				if strings.Contains(l, version) {
					version_exist = true
					break
				}
			}

			if !version_exist {
				to_process[n][1] = "false"
			} else {
				to_process[n][1] = "true"
			}

			break
		}
	}

	b <- true
}

type AppGeneral struct {
	Name           string `json:"name"`
	App_size       string `json:"app_size"`
	App_data_size  string `json:"app_data_size"`
	App_cache_size string `json:"app_cache_size"`
	Version        string `json:"version"`
}

func delete_empty(s []string) []string {
	var r []string
	for _, str := range s {
		if str != "" {
			r = append(r, str)
		}
	}
	return r
}
