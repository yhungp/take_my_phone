package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os/exec"
	"strings"

	"github.com/gorilla/mux"
)

func api() {
	InitializeRoutes()

	log.Fatal(http.ListenAndServe(":8080", router))
}

var router = mux.NewRouter().StrictSlash(true)

func InitializeRoutes() {
	router.HandleFunc("/devices", adbList)
}

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

func delete_empty(s []string) []string {
	var r []string
	for _, str := range s {
		if str != "" {
			r = append(r, str)
		}
	}
	return r
}
