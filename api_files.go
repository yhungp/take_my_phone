package main

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os/exec"
	"strings"

	"github.com/gorilla/mux"
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

func listMusic(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json; charset=utf-8")

	id := strings.Fields(mux.Vars(r)["id"])

	cmd := exec.Command("adb", "-s", id[len(id)-1], "shell", "find", "/storage/emulated/0/")
	stdout, _ := cmd.Output()

	lines := strings.Split(string(stdout), "\n")[1:]
	lines = delete_empty(lines)

	formats := []string{
		".3gp", ".aa", ".aac", ".aax", ".act", ".aiff",
		".alac", ".amr", ".ape", ".au", ".awb", ".dss",
		".dvf", ".flac", ".gsm", ".iklax", ".ivs", ".m4a",
		".m4b", ".m4p", ".mmf", ".mp3", ".mpc", ".msv",
		".nmf", ".ogg", ".oga", ".mogg", ".opus", ".ra",
		".rm", ".raw", ".rf64", ".sln", ".tta", ".voc",
		".vox", ".wav", ".wma", ".wv", ".webm", ".8svx",
		".cda"}

	var musicFiles []string

	for _, l := range lines[1:] {
		l = strings.ReplaceAll(l, "\r", "")
		splitted := strings.Split(l, ".")

		for _, format := range formats {
			if format == "."+splitted[len(splitted)-1] {
				musicFiles = append(musicFiles, l)
				break
			}
		}
	}

	json.NewEncoder(w).Encode(musicFiles)
}

func listVideo(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json; charset=utf-8")

	id := strings.Fields(mux.Vars(r)["id"])

	cmd := exec.Command("adb", "-s", id[len(id)-1], "shell", "find", "/storage/emulated/0/")
	stdout, _ := cmd.Output()

	lines := strings.Split(string(stdout), "\n")[1:]
	lines = delete_empty(lines)

	formats := []string{
		".webm", ".mkv", ".flv", ".vob", ".ogv", ".ogg",
		".drc", ".gif", ".gifv", ".mng", ".avi", ".MTS",
		".M2TS", ".TS", ".mov", ".qt", ".wmv", ".yuv",
		".rm", ".rmvb", ".viv", ".asf", ".amv", ".mp4",
		".m4p", ".m4v", ".mpg", ".mp2", ".mpeg", ".mpe",
		".mpv", ".mpg", ".mpeg", ".m2v", ".m4v", ".svi",
		".3gp", ".3g2", ".mxf", ".roq", ".nsv", ".flv",
		".f4v", ".f4p", ".f4a", ".f4b",
	}

	var videoFiles []string

	for _, l := range lines[1:] {
		l = strings.ReplaceAll(l, "\r", "")
		splitted := strings.Split(l, ".")

		for _, format := range formats {
			if format == "."+splitted[len(splitted)-1] {
				videoFiles = append(videoFiles, l)
				break
			}
		}
	}

	json.NewEncoder(w).Encode(videoFiles)
}

func listPhotos(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json; charset=utf-8")

	id := strings.Fields(mux.Vars(r)["id"])

	cmd := exec.Command("adb", "-s", id[len(id)-1], "shell", "find", "/storage/emulated/0/")
	stdout, _ := cmd.Output()

	lines := strings.Split(string(stdout), "\n")[1:]
	lines = delete_empty(lines)

	formats := []string{
		".jpg", ".jpeg", ".jpe", ".jif", ".jfif", ".jfi",
		".png", ".gif", ".webp", ".tiff", ".tif", ".psd",
		".raw", ".arw", ".cr2", ".nrw", ".k25", ".bmp",
		".dib", ".heif", ".heic", ".ind", ".indd", ".indt",
		".jp2", ".j2k", ".jpf", ".jpx", ".jpm", ".mj2",
		".svg", ".svgz", ".ai", ".eps",
	}

	var photoFiles []string

	for _, l := range lines[1:] {
		l = strings.ReplaceAll(l, "\r", "")
		splitted := strings.Split(l, ".")

		for _, format := range formats {
			if format == "."+splitted[len(splitted)-1] {
				photoFiles = append(photoFiles, l)
				break
			}
		}
	}

	json.NewEncoder(w).Encode(photoFiles)
}
