package main

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os/exec"
	"strings"
)

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
