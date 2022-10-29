package main

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os/exec"
	"strings"

	"github.com/gorilla/mux"
)

func api() {
	InitializeRoutes()

	// log.Fatal(http.ListenAndServe(":8080", router))
	http.ListenAndServe(":8080", setHeaders(router))
}

func setHeaders(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		//anyone can make a CORS request (not recommended in production)
		w.Header().Set("Access-Control-Allow-Origin", "*")
		//only allow GET, POST, and OPTIONS
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		//Since I was building a REST API that returned JSON, I set the content type to JSON here.
		w.Header().Set("Content-Type", "application/json")
		//Allow requests to have the following headers
		w.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization, cache-control")
		//if it's just an OPTIONS request, nothing other than the headers in the response is needed.
		//This is essential because you don't need to handle the OPTIONS requests in your handlers now
		if r.Method == "OPTIONS" {
			return
		}

		h.ServeHTTP(w, r)
	})
}

var router = mux.NewRouter().StrictSlash(true)

func InitializeRoutes() {
	router.HandleFunc("/devices", adbList)
	router.HandleFunc("/device-apps/{id}", deviceApps)
	router.HandleFunc("/list-files/", listFiles).Methods("POST")
}

type FilePath struct {
	Id   string `json:"id"`
	Path string `json:"path"`
}

type PhoneFileFolder struct {
	Type int    `json:"type"`
	Path string `json:"path"`
	Size string `json:"size"`
}

var baseDirectory = "/storage/emulated/0"

func listFiles(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json; charset=utf-8")

	reqBody, _ := ioutil.ReadAll(r.Body)

	var path FilePath
	json.Unmarshal([]byte(string(reqBody)), &path)

	out := baseDirectory + path.Path

	cmd := exec.Command("adb", "-s", path.Id, "shell", "ls", "-la", out)
	stdout, _ := cmd.Output()

	lines := strings.Split(string(stdout), "\n")[1:]
	lines = delete_empty(lines)

	filesFolders := make([]PhoneFileFolder, 0, len(lines))

	if path.Path != "/" {
		filesFolders = append(filesFolders, PhoneFileFolder{
			Type: 0,
			Path: "..",
			Size: "",
		})
	}

	for _, l := range lines {
		fields := strings.Fields(l)
		p := strings.Join(fields[7:], " ")
		size := fields[4]

		pType := 0

		if strings.Split(fields[0], "")[0] == "d" {
			pType = 0
			size = ""
		} else {
			pType = 1
		}

		if p != "." && p != ".." {
			filesFolders = append(filesFolders, PhoneFileFolder{
				Type: pType,
				Path: p,
				Size: size,
			})
		}
	}

	json.NewEncoder(w).Encode(filesFolders)
}
