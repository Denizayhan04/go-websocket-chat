package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
)

// WebSocket bağlantılarını yükseltmek için kullanılan upgrader
var upgrader = websocket.Upgrader{
	// Farklı origin'lerden (Next.js'in çalıştığı port gibi) gelen isteklere izin ver
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// Frontend'den gelen ve frontend'e gönderilen mesajların yapısı
type Message struct {
	Sender string `json:"sender"`
	Text   string `json:"text"`
}

// Aktif client bağlantılarını tutan map
var clients = make(map[*websocket.Conn]bool)

// Gelen mesajları tüm client'lara dağıtan channel
var broadcast = make(chan Message)

// Gelen WebSocket bağlantılarını yönetir
func handleConnections(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Upgrade hatası:", err)
		return
	}
	defer ws.Close()

	// Yeni client'ı listeye ekle
	clients[ws] = true
	fmt.Println("Yeni bir client bağlandı. Toplam client:", len(clients))

	for {
		var msg Message
		// Client'tan gelen JSON mesajını oku ve msg struct'ına ata
		err := ws.ReadJSON(&msg)
		if err != nil {
			fmt.Println("Okuma hatası (bağlantı koptu):", err)
			delete(clients, ws)
			fmt.Println("Bir client ayrıldı. Kalan client:", len(clients))
			break
		}
		// Gelen mesajı broadcast channel'ına gönder
		broadcast <- msg
	}
}

// Gelen mesajları tüm client'lara gönderir
func handleMessages() {
	for {
		// Broadcast channel'ından bir mesaj al
		msg := <-broadcast
		// Mesajı bağlı olan her bir client'a gönder
		for client := range clients {
			err := client.WriteJSON(msg)
			if err != nil {
				fmt.Println("Yazma hatası:", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}

func main() {
	// Mesajları dinlemek için bir goroutine başlat
	go handleMessages()

	// WebSocket endpoint'i
	http.HandleFunc("/ws", handleConnections)

	// Sunucuyu 8080 portunda başlat
	fmt.Println("Go WebSocket sunucusu 5050 portunda çalışıyor...")
	err := http.ListenAndServe(":5050", nil)
	if err != nil {
		fmt.Println("ListenAndServe hatası:", err)
	}
}
