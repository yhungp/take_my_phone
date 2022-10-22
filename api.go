package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func api() {
	InitializeRoutes()

	log.Fatal(http.ListenAndServe(":8080", router))
}

var router = mux.NewRouter().StrictSlash(true)

func InitializeRoutes() {
	router.HandleFunc("/devices", adbList)
	router.HandleFunc("/device-apps/{id}", deviceApps)
	router.HandleFunc("/list-files/", listFiles).Methods("POST")
}

type FilePath struct {
	Path string `json:"path"`
}

var baseDirectory = "/storage/emulated/0"

func listFiles(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	reqBody, _ := ioutil.ReadAll(r.Body)

	var path FilePath

	json.Unmarshal([]byte(string(reqBody)), &path)

	out := baseDirectory + path.Path
	json.NewEncoder(w).Encode(out)
}
