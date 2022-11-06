package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"reflect"
	"strconv"

	_ "github.com/mattn/go-sqlite3"
)

var database *sql.DB

func startDatabase() {
	if _, err := os.Stat("database.db"); err != nil {
		file, err := os.Create("database.db")
		if err != nil {
			log.Fatal(err)
		}
		file.Close()
	}

	database, _ = sql.Open("sqlite3", "database.db")

	fmt.Println(reflect.TypeOf(database))

	tables := [][]string{
		{
			"devices",
			`id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
			"Serial" TEXT UNIQUE,
			"Brand" TEXT,
			"Device" TEXT,
			"Model" TEXT`,
		},
		{
			"apps",
			`"id"	INTEGER NOT NULL UNIQUE,
			"app"	TEXT NOT NULL,
			"name"	TEXT NOT NULL,
			"app_size"	TEXT NOT NULL,
			"data_size"	TEXT NOT NULL,
			"cache_size"	TEXT NOT NULL,
			"version"	TEXT NOT NULL,
			"serial"	TEXT NOT NULL,
			PRIMARY KEY("id" AUTOINCREMENT),
			FOREIGN KEY ("serial") REFERENCES "devices" ("serial")
			ON DELETE SET NULL`,
		},
	}

	for _, table := range tables {
		createTable(database, table[0], table[1])
	}
}

func createTable(db *sql.DB, table_name string, parameters string) {
	table_exist := fmt.Sprintf("SELECT name FROM sqlite_master WHERE type='table' AND name='%s';", table_name)
	record, err := db.Query(table_exist)

	if err != nil {
		log.Fatal(err)
	}
	defer record.Close()

	count := 0
	for record.Next() {
		count += 1
	}

	if count == 0 {
		devices_table := fmt.Sprintf(`CREATE TABLE %s ( %s );`, table_name, parameters)
		query, err := db.Prepare(devices_table)
		if err != nil {
			log.Fatal(err)
		}
		query.Exec()
		fmt.Println("Table created successfully!")
	}
}

func addDevices(db *sql.DB, serial string, brand string, device string, model string) {
	records := `INSERT INTO devices (Serial, Brand, Device, Model) VALUES (?, ?, ?, ?)`
	query, err := db.Prepare(records)
	if err != nil {
		log.Fatal(err)
	}
	_, err = query.Exec(serial, brand, device, model)
	if err != nil {
		log.Fatal(err)
	}
}

func listDBdevices(db *sql.DB) [][]string {
	record, err := db.Query("SELECT * FROM devices")
	if err != nil {
		log.Fatal(err)
	}
	defer record.Close()

	var devices [][]string

	for record.Next() {
		var id int
		var serial string
		var brand string
		var device string
		var model string
		record.Scan(&id, &serial, &brand, &device, &model)
		devices = append(devices, []string{
			serial,
			brand,
			device,
			model,
		})
	}

	return devices
}

func getDeviceIndex(db *sql.DB, serial string) int {
	query := fmt.Sprintf("SELECT * FROM devices where serial = \"%s\"", serial)
	record, err := db.Query(query)
	if err != nil {
		log.Fatal(err)
	}
	defer record.Close()

	for record.Next() {
		var id int
		var serial string
		var brand string
		var device string
		var model string
		record.Scan(&id, &serial, &brand, &device, &model)
		return id
	}

	return -1
}

// func addApps(db *sql.DB, apps string, names string, app_sizes string, data_sizes string, cache_sizes string, versions string, serial string) {
func addApps(db *sql.DB, appNames [][]string, serial string) bool {
	query := fmt.Sprintf("SELECT * FROM apps where serial = \"%s\"", serial)
	record, err := db.Query(query)
	if err != nil {
		log.Fatal(err)
	}
	defer record.Close()

	var ids []int

	for record.Next() {
		var ser string
		var id int
		var apps string
		var names string
		var app_sizes string
		var data_sizes string
		var cache_sizes string
		var versions string
		record.Scan(&id, &apps, &names, &app_sizes, &data_sizes, &cache_sizes, &versions, &ser)
		ids = append(ids, id)
	}

	if len(ids) > 0 {
		for _, id := range ids {
			records := fmt.Sprintf(`DELETE FROM apps where id=%d`, id)
			query, err := db.Prepare(records)
			if err != nil {
				continue
			}
			_, err = query.Exec()
			if err != nil {
				continue
			}

			query.Close()
		}
	}

	var errors []string
	for _, app := range appNames {
		records := `INSERT INTO apps (app, name, app_size, data_size, cache_size, version, serial) VALUES (?, ?, ?, ?, ?, ?, ?)`
		query, err := db.Prepare(records)
		if err != nil {
			errors = append(errors, app[0])
			continue
		}
		_, err = query.Exec(app[0], app[1], app[2], app[3], app[4], app[5], serial)
		if err != nil {
			errors = append(errors, app[0])
			continue
		}

		query.Close()
	}

	defer record.Close()
	return true
}

func listAppsByDevice(db *sql.DB, serial string) [][]string {
	query := fmt.Sprintf("SELECT * FROM devices where Serial = \"%s\"", serial)
	record, err := db.Query(query)
	if err != nil {
		log.Fatal(err)
	}
	defer record.Close()

	var devices [][]string

	for record.Next() {
		var id int
		var serial string
		var brand string
		var device string
		var model string
		record.Scan(&id, &serial, &brand, &device, &model)
		devices = append(devices, []string{
			fmt.Sprintf("%d", id),
			serial,
			brand,
			device,
			model,
		})
	}

	list_apps := [][]string{
		{},
		{},
		{},
		{},
		{},
		{},
	}

	if len(devices) != 0 {
		dev := devices[0]
		id, _ := strconv.Atoi(dev[0])

		query = fmt.Sprintf("SELECT * FROM apps where serial = %d", id)
		record, err := db.Query(query)
		if err != nil {
			fmt.Println(err)
		}
		defer record.Close()

		for record.Next() {
			var id int
			var app string
			var name string
			var app_size string
			var data_size string
			var cache_size string
			var version string
			var ser string
			record.Scan(&id, &app, &name, &app_size, &data_size, &cache_size, &version, &ser)

			list_apps[0] = append(list_apps[0], app)
			list_apps[1] = append(list_apps[1], name)
			list_apps[2] = append(list_apps[2], app_size)
			list_apps[3] = append(list_apps[3], data_size)
			list_apps[4] = append(list_apps[4], cache_size)
			list_apps[5] = append(list_apps[5], version)
		}
	}

	return list_apps
}
