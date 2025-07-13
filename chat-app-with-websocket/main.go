package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var clients = make(map[*websocket.Conn]bool)
var broadcast = make(chan string)

func handleConnections(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Hata:", err)
		return
	}
	defer ws.Close()

	clients[ws] = true

	for {
		var msg string
		err := ws.ReadJSON(&msg)
		if err != nil {
			fmt.Println("Bağlantı koptu:", err)
			delete(clients, ws)
			break
		}
		broadcast <- msg
	}
}

func handleMessages() {
	for {
		msg := <-broadcast
		for client := range clients {
			err := client.WriteJSON(msg)
			if err != nil {
				fmt.Println("Mesaj gönderilirken hata:", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}

func main() {
	go handleMessages()

	http.HandleFunc("/ws", handleConnections)
	http.Handle("/", http.FileServer(http.Dir("./static")))

	fmt.Println("Sunucu 8080 portunda çalışıyor...")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Println("Sunucu hata verdi:", err)
	}
}
