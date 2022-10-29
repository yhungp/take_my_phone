package main

import (
	"embed"
	"net/http"
	"os/exec"
	"strings"
	"time"

	"github.com/webview/webview"
)

type IncrementResult struct {
	Count uint `json:"count"`
}

var allRes = ""
var port = "3000"
var server_started = false

func getUsbAdded(res string) bool {
	if strings.Contains(res, "webpack compiled with") {
		server_started = true
		return true
	}

	if strings.Contains(res, "\n") {
		return true
	}

	return false
}

//go:embed build
var public embed.FS

func fsHandler() http.Handler {
	return http.FileServer(http.FS(public))
}

func startServer() {
	server_started = true
	http.ListenAndServe(":9500", fsHandler())
}

func main() {
	go startServer()

	resp, err := http.Get("http://localhost:9500/build")

	for {
		if err != nil || resp.StatusCode != 200 {
			time.Sleep(time.Second)
			resp, err = http.Get("http://localhost:9500/build")
		} else {
			break
		}
	}

	w := webview.New(false)
	defer w.Destroy()
	w.SetTitle("Bind Example")
	w.SetSize(800, 600, webview.HintNone)

	server_url := "http://localhost:9500/build"
	w.Navigate(server_url)

	w.Run()
	cmdName := "kill -9 $(lsof -t -i:9500)"
	cmd := exec.Command("sh", "-c", cmdName)
	cmd.Run()
}
