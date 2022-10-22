package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os/exec"
	"sort"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
)

func adbList(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	app := "adb"

	arg0 := "devices"

	cmd := exec.Command(app, arg0)
	stdout, err := cmd.Output()

	if err != nil {
		json.NewEncoder(w).Encode(string(err.Error()))
	}

	out := strings.ReplaceAll(string(stdout), "\r", "")

	var devices = []string{}

	for _, s := range strings.Split(out, "\n") {
		if strings.Contains(s, "\t") {
			dev := strings.Split(s, "\t")[0]
			devices = append(devices, dev)
		}
	}

	devices = delete_empty(devices)

	json.NewEncoder(w).Encode(devices)
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

func deviceApps(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	id := mux.Vars(r)["id"]

	// Copy aapt-arm-pie to phone
	copy_cmd := fmt.Sprintf("-s %s push F:/Proyectos/Go/take_my_phone/files/aapt-arm-pie /data/local/tmp", id)
	cmd := exec.Command("adb", copy_cmd)

	set_permission := fmt.Sprintf("-s %s chmod 0755 /data/local/tmp/aapt-arm-pie", id)
	cmd = exec.Command("adb", set_permission)

	// Get diskstats
	cmd = exec.Command("adb", "-s", id, "shell", "dumpsys", "diskstats")
	stdout, err := cmd.Output()

	out := strings.ReplaceAll(string(stdout), "\r", "")
	splitted_diskstats_out := strings.Split(out, "\n")

	// List apps
	// cmd = exec.Command("adb", "-s", id, "shell", "pm", "list", "packages", "-f ")
	cmd = exec.Command("adb", "-s", id, "shell", "cmd package list packages -3")
	stdout, err = cmd.Output()

	if err != nil {
		json.NewEncoder(w).Encode(string(err.Error()))
	}

	out = strings.ReplaceAll(string(stdout), "\r", "")

	var third_party_apps = strings.Split(out, "\n")
	third_party_apps = delete_empty(third_party_apps)

	for i, s := range third_party_apps {
		third_party_apps[i] = s[8:]
	}

	sort.Strings(third_party_apps)

	indexes := getIndexesOfApps(third_party_apps, splitted_diskstats_out)

	// get specific size types
	appSizes := getSpecificSize("App Sizes:", splitted_diskstats_out, indexes)
	appDataSizes := getSpecificSize("App Data Sizes:", splitted_diskstats_out, indexes)
	appCacheSizes := getSpecificSize("Cache Sizes:", splitted_diskstats_out, indexes)

	// appNames := make(map[string]AppGeneral)

	appNames := make([][]string, 0, len(third_party_apps))

	for i, _ := range third_party_apps[:5] {
		cmd = exec.Command("adb", "-s", id, "shell", "pm", "path", third_party_apps[i])
		stdout, _ = cmd.Output()

		out = strings.ReplaceAll(string(stdout), "\r", "")
		out = strings.Split(out, "\n")[0][8:]

		cmd = exec.Command("adb", "-s", id, "shell", "/data/local/tmp/aapt-arm-pie", "d", "badging", out)
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

		app_name := third_party_apps[i]

		if name != "" {
			app_name = name
		}

		appNames = append(appNames, []string{
			third_party_apps[i],
			app_name,
			appSizes[third_party_apps[i]],
			appDataSizes[third_party_apps[i]],
			appCacheSizes[third_party_apps[i]],
			version,
		})
	}

	sort.Slice(appNames, func(i, j int) bool {
		name1 := appNames[i][1]
		name2 := appNames[j][1]

		return name1 < name2
	})

	json.NewEncoder(w).Encode(appNames)
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
