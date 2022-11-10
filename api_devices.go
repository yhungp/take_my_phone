package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os/exec"
	"reflect"
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

	var devices = [][]string{}

	dbDevices := listDBdevices(database)
	devices = append(devices, dbDevices...)

	for _, s := range strings.Split(out, "\n") {
		if strings.Contains(s, "\t") {
			dev := strings.Split(s, "\t")[0]

			brand := executeCommand(app, fmt.Sprintf("-s %s shell getprop ro.product.vendor.manufacturer", dev))
			device := executeCommand(app, fmt.Sprintf("-s %s shell getprop ro.product.vendor.device", dev))
			model := executeCommand(app, fmt.Sprintf("-s %s shell getprop ro.product.vendor.model", dev))

			flag_add := true
			for _, d := range devices {
				if reflect.DeepEqual(d, []string{dev, brand, device, model}) {
					flag_add = false
					break
				}
			}

			if flag_add {
				devices = append(devices, []string{dev, brand, device, model})
			}
		}
	}

	// devices = delete_empty(devices)

	json.NewEncoder(w).Encode(devices)
}

func deviceStorage(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	id := strings.Fields(mux.Vars(r)["id"])

	app := "adb"
	code := fmt.Sprintf("-s %s shell dumpsys diskstats", id[len(id)-1])
	cmd := exec.Command(app, strings.Fields(code)...)
	stdout, _ := cmd.Output()

	// out := strings.ReplaceAll(string(stdout), "\r", "")
	lines := strings.Split(string(stdout), "\n")

	apps := getStoragesSize("App Size:", lines)
	photos := getStoragesSize("Photos Size:", lines)
	videos := getStoragesSize("Videos Size:", lines)
	audio := getStoragesSize("Audio Size:", lines)
	system := getStoragesSize("System Size:", lines)
	downloads := getStoragesSize("Downloads Size:", lines)

	code = fmt.Sprintf("-s %s shell df /sdcard | tail -n 1", id[len(id)-1])
	cmd = exec.Command(app, strings.Fields(code)...)
	stdout, err := cmd.Output()

	if strings.Contains(string(stdout), "device offline") || err != nil {
		json.NewEncoder(w).Encode("device offline")
		return
	}

	storage := strings.Fields(string(stdout))
	total := storage[1] + "000"
	used := storage[2] + "000"
	free := storage[3] + "000"

	var storage_description = make(map[string]int)

	storage_description["apps"], _ = strconv.Atoi(apps)
	storage_description["photos"], _ = strconv.Atoi(photos)
	storage_description["videos"], _ = strconv.Atoi(videos)
	storage_description["audio"], _ = strconv.Atoi(audio)
	storage_description["system"], _ = strconv.Atoi(system)
	storage_description["downloads"], _ = strconv.Atoi(downloads)
	storage_description["total"], _ = strconv.Atoi(total)
	storage_description["used"], _ = strconv.Atoi(used)
	storage_description["free"], _ = strconv.Atoi(free)

	json.NewEncoder(w).Encode(storage_description)
}

func getStoragesSize(space_type string, lines []string) string {
	for _, l := range lines {
		if strings.Contains(l, space_type) {
			size := strings.Fields(l)

			return size[len(size)-1]
		}
	}

	return ""
}

var added_devices []addedDevice

type addedDevice struct {
	Id []string `json:"id"`
}

func addedDevices(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	reqBody, _ := io.ReadAll(r.Body)

	var added addedDevice
	json.Unmarshal([]byte(string(reqBody)), &added)

	flag_exist := false
	if added.Id != nil {
		for _, d := range added_devices {
			if d.Id[0] == added.Id[0] {
				flag_exist = true
				break
			}
		}
	}

	addDevices(database, added.Id[0], added.Id[1], added.Id[2], added.Id[3])

	if !flag_exist {
		json.NewEncoder(w).Encode(true)
	} else {
		json.NewEncoder(w).Encode(false)
	}
}

func listAddedDevices(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	dbDevices := listDBdevices(database)
	added_devices = make([]addedDevice, 0)

	for _, dev := range dbDevices {
		var added addedDevice
		added.Id = []string{dev[0], dev[1], dev[2], dev[3]}
		added_devices = append(added_devices, added)
	}

	json.NewEncoder(w).Encode(added_devices)
}

type deviceRAM struct {
	Total     int `json:"total"`
	Available int `json:"available"`
}

func getDeviceRAM(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	id := strings.Fields(mux.Vars(r)["id"])

	app := "adb"
	code := fmt.Sprintf("-s %s shell cat /proc/meminfo", id[len(id)-1])
	cmd := exec.Command(app, strings.Fields(code)...)
	stdout, _ := cmd.Output()

	lines := strings.Split(string(stdout), "\n")
	var ram deviceRAM

	ram.Available, _ = strconv.Atoi(getRamFromDescription("MemAvailable:", lines))
	ram.Total, _ = strconv.Atoi(getRamFromDescription("MemTotal:", lines))

	json.NewEncoder(w).Encode(ram)
}

func getRamFromDescription(space_type string, lines []string) string {
	for _, l := range lines {
		if strings.Contains(l, space_type) {
			size := strings.Fields(l)

			return size[len(size)-2]
		}
	}

	return ""
}

func getDeviceInformation(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	id := mux.Vars(r)["id"]

	cmd := exec.Command("adb", "-s", id, "shell", "cmd package list packages -3")
	stdout, err := cmd.Output()

	if err != nil {
		json.NewEncoder(w).Encode(string(err.Error()))
	}

	out := strings.ReplaceAll(string(stdout), "\r", "")

	var third_party_apps = strings.Split(out, "\n")
	third_party_apps = delete_empty(third_party_apps)

	for i, s := range third_party_apps {
		third_party_apps[i] = s[8:]
	}

	sort.Strings(third_party_apps)

	app := "adb"

	brand := executeCommand(app, fmt.Sprintf("-s %s shell getprop ro.product.vendor.manufacturer", id))
	device := executeCommand(app, fmt.Sprintf("-s %s shell getprop ro.product.vendor.device", id))
	model := executeCommand(app, fmt.Sprintf("-s %s shell getprop ro.product.vendor.model", id))
	board := executeCommand(app, fmt.Sprintf("-s %s shell getprop ro.product.board", id))
	android := executeCommand(app, fmt.Sprintf("-s %s shell getprop ro.build.version.release", id))

	var info PhoneInformation
	info.AppCount = len(third_party_apps)
	info.Brand = brand
	info.Device = device
	info.Model = model
	info.Board = board
	info.Android = android

	json.NewEncoder(w).Encode(info)
}

type PhoneInformation struct {
	Brand    string `json:"brand"`
	Device   string `json:"device"`
	Model    string `json:"model"`
	Board    string `json:"board"`
	Android  string `json:"android"`
	AppCount int    `json:"app_count"`
}
