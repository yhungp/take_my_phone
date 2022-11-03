package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"reflect"

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
			"apps"	TEXT NOT NULL,
			"names"	TEXT NOT NULL,
			"app_sizes"	TEXT NOT NULL,
			"data_sizes"	TEXT NOT NULL,
			"cache_sizes"	TEXT NOT NULL,
			"versions"	TEXT NOT NULL,
			PRIMARY KEY("id" AUTOINCREMENT),
			FOREIGN KEY("id") REFERENCES "devices"("id")
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
