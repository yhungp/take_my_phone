package main

import (
	"net/http"

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
	router.HandleFunc("/device-info/{id}", getDeviceInformation)
	router.HandleFunc("/device-space/{id}", deviceStorage)
	router.HandleFunc("/list-files/", listFiles).Methods("POST")
	router.HandleFunc("/add-device/", addedDevices).Methods("POST")
	router.HandleFunc("/list-added-devices/", listAddedDevices)
	router.HandleFunc("/device-ram/{id}/", getDeviceRAM)
}
