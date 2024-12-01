class_name WebSocketClient extends Node

signal connecting
signal open
signal closed
signal received(packet_buf: PackedByteArray)

var _socket: WebSocketPeer

var _is_connecting: bool = false
var _is_open: bool = false
var _is_closed: bool = true


func _init():
	_socket = WebSocketPeer.new()


func connect_to_host(host: String, port: int, use_ssl := false) -> void:
	var url = "ws://" + host + ":" + str(port) + "/ws"

	if use_ssl:
		url = "wss://" + host + ":" + str(port) + "/ws"

	var error = _socket.connect_to_url(url)

	if error != OK:
		closed.emit()
		_reset_state()
	else:
		connecting.emit()
		_is_connecting = true


func disconnect_from_host(code: int = 1000, reason: String = "") -> void:
	if _socket.get_ready_state() == WebSocketPeer.STATE_OPEN or _socket.get_ready_state() == WebSocketPeer.STATE_CLOSING:
		_socket.close(code, reason)
	else:
		closed.emit()
		_reset_state()



func send_message(message: ClientMessage) -> Error:
	if _socket.get_ready_state() != WebSocketPeer.STATE_OPEN:
		return ERR_CONNECTION_ERROR

	var result := _socket.put_packet(message.get_buffer())

	if result != OK:
		disconnect_from_host()

	return result


func poll() -> void:
	_socket.poll()
	var state := _socket.get_ready_state()

	match state:
		WebSocketPeer.STATE_CONNECTING:
			if not _is_connecting:
				connecting.emit()
				_is_connecting = true

		WebSocketPeer.STATE_OPEN:
			if not _is_open:
				open.emit()
				_is_open = true
				_is_closed = false

			while _socket.get_available_packet_count() > 0:
				var packet = _socket.get_packet()
				received.emit(packet)

		WebSocketPeer.STATE_CLOSED:
			closed.emit()
			_reset_state()


func _reset_state() -> void:
	_is_connecting = false
	_is_open = false
	_is_closed = true
