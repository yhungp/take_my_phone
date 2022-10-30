package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os/exec"
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

	for _, s := range strings.Split(out, "\n") {
		if strings.Contains(s, "\t") {
			dev := strings.Split(s, "\t")[0]

			brand := executeCommand(app, fmt.Sprintf("-s %s shell getprop ro.product.vendor.manufacturer", dev))
			device := executeCommand(app, fmt.Sprintf("-s %s shell getprop ro.product.vendor.device", dev))
			model := executeCommand(app, fmt.Sprintf("-s %s shell getprop ro.product.vendor.model", dev))

			devices = append(devices, []string{dev, brand, device, model})
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

	cmd = exec.Command(app, strings.Fields("shell df /sdcard | tail -n 1")...)
	stdout, _ = cmd.Output()

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

	reqBody, _ := ioutil.ReadAll(r.Body)

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

	if !flag_exist {
		added_devices = append(added_devices, added)
		json.NewEncoder(w).Encode(true)
	} else {
		json.NewEncoder(w).Encode(false)
	}
}

func listAddedDevices(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	json.NewEncoder(w).Encode(added_devices)
}
