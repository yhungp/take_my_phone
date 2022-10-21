package main

import (
	"embed"
	"sync"
)

// /go:embed front/
var fs embed.FS

type counter struct {
	sync.Mutex
	count int
}

func (c *counter) Add(n int) {
	c.Lock()
	defer c.Unlock()
	c.count = c.count + n
}

func (c *counter) Value() int {
	c.Lock()
	defer c.Unlock()
	return c.count
}

func main() {
	api()

	// args := []string{}
	// if runtime.GOOS == "linux" {
	// 	args = append(args, "--class=Lorca")
	// }
	// ui, err := lorca.New("", "", 1280, 720, args...)
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// defer ui.Close()

	// ui.Bind("start", func() {
	// 	log.Println("UI is ready")
	// })

	// c := &counter{}
	// ui.Bind("counterAdd", c.Add)
	// ui.Bind("counterValue", c.Value)

	// ln, err := net.Listen("tcp", "127.0.0.1:0")
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// defer ln.Close()
	// go http.Serve(ln, http.FileServer(http.FS(fs)))
	// ui.Load(fmt.Sprintf("http://%s/front/dist", ln.Addr()))

	// ui.Eval(`
	// 	console.log("Hello, world!");
	// 	console.log('Multiple values:', [1, false, {"x":5}]);
	// `)

	// sigc := make(chan os.Signal)
	// signal.Notify(sigc, os.Interrupt)
	// select {
	// case <-sigc:
	// case <-ui.Done():
	// }

	// log.Println("exiting...")
}
