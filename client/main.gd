class_name Main extends Control


@export var fps_label: Label

var _websocket: WebSocketClient = Multiplayer.websocket
var _handler: Handler = Handler.new()
var _constants: Constants = Constants.new()
var _notification_ui: NotificationUI = NotificationUI.new()

var _alert_timer: Timer
var _ping_interval: float = 1.0
var _time_elapsed: float = 0.0


func _ready() -> void:
	get_tree().set_auto_accept_quit(false)

	_alert_timer = Timer.new()
	_alert_timer.wait_time = 5
	_alert_timer.one_shot = true
	_alert_timer.name = 'AlertTimer'
	self.add_child(_alert_timer)

	# Se conecta ao servidor
	_websocket.connect_to_host(
		_constants.host,
		_constants.port
	)

	# Conecta o sinal de conectando
	_websocket.connecting.connect(
		_on_connecting
	)

	# Conecta o sinal de conexão aberta
	_websocket.open.connect(
		_on_open
	)

	# Conecta o sinal de conexão fechada
	_websocket.closed.connect(
		_on_closed
	)

	# Conecta o sinal de recebimento de dados
	_websocket.received.connect(
		_on_received
	)


func _notification(what: int) -> void:
	if what == NOTIFICATION_WM_CLOSE_REQUEST:
		_websocket.disconnect_from_host()
		get_tree().quit()


func _process(delta) -> void:
	fps_label.text = 'FPS: ' + str(Engine.get_frames_per_second())

	if _websocket != null:
		_websocket.poll()

		_time_elapsed += delta
		if _time_elapsed >= _ping_interval:
			PingOutgoing.new().send()
			_time_elapsed = 0.0


func _on_connecting() -> void:
	if not _alert_timer.is_stopped():
		return

	_notification_ui.show_notification(get_tree(), 'Conectando ao servidor...')


func _on_open() -> void:
	if not _alert_timer.is_stopped():
		return

	_notification_ui.show_notification(get_tree(), 'Conectado ao servidor...')


func _on_closing() -> void:
	if not _alert_timer.is_stopped():
		return

	_notification_ui.show_notification(get_tree(), 'Desconectando do servidor...')
	_alert_timer.start()


func _on_closed() -> void:
	if not _alert_timer.is_stopped():
		return

	_notification_ui.show_notification(get_tree(), 'Não foi possível se conectar ao servidor!')
	_alert_timer.start()


func _on_received(buffer: PackedByteArray) -> void:
	if buffer.size() < 2:
		_websocket.disconnect_from_host()
		return

	var client_message: ServerMessage = ServerMessage.new(buffer)
	_handler.handle_message(client_message, get_tree())
