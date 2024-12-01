class_name Handler extends RefCounted


var request_handlers: Dictionary = {}

var ping := PingIncoming.new()
var alert := AlertIncoming.new()
var notification := NotificationIncoming.new()
var access_account := AccessAccountIncoming.new()
var create_account := CreateAccountIncoming.new()
var character_list := CharacterListIncoming.new()
var create_character := CreateCharacterIncoming.new()
var delete_character := DeleteCharacterIncoming.new()
var select_character := SelectCharacterIncoming.new()
var move_character_to_others := MoveCharacterToOthersIncoming.new()
var block_character_movement := BlockCharacterMovementIncoming.new()
var new_character_to := NewCharacterToIncoming.new()
var world_characters_to := WorldCharactersToIncoming.new()
var disconnect_character := DisconnectCharacterIncoming.new()
var chat := ChatIncoming.new()


func _init() -> void:
	request_handlers[ServerHeaders.Headers.PING] = Callable(
		ping, "handle"
	)

	request_handlers[ServerHeaders.Headers.ALERT] = Callable(
		alert, "handle"
	)

	request_handlers[ServerHeaders.Headers.ALERT] = Callable(
		notification, "handle"
	)

	request_handlers[ServerHeaders.Headers.ACCESS_ACCOUNT] = Callable(
		access_account, "handle"
	)

	request_handlers[ServerHeaders.Headers.CREATE_ACCOUNT] = Callable(
		create_account, "handle"
	)

	request_handlers[ServerHeaders.Headers.CHARACTER_LIST] = Callable(
		character_list, "handle"
	)

	request_handlers[ServerHeaders.Headers.CREATE_CHARACTER] = Callable(
		create_character, "handle"
	)

	request_handlers[ServerHeaders.Headers.DELETE_CHARACTER] = Callable(
		delete_character, "handle"
	)

	request_handlers[ServerHeaders.Headers.SELECT_CHARACTER] = Callable(
		select_character, "handle"
	)

	request_handlers[ServerHeaders.Headers.MOVE_CHARACTER_TO_OTHERS] = Callable(
		move_character_to_others, "handle"
	)

	request_handlers[ServerHeaders.Headers.BLOCK_CHARACTER_MOVEMENT] = Callable(
		block_character_movement, "handle"
	)

	request_handlers[ServerHeaders.Headers.WORLD_CHARACTERS_TO] = Callable(
		world_characters_to, "handle"
	)

	request_handlers[ServerHeaders.Headers.NEW_CHARACTER_TO] = Callable(
		new_character_to, "handle"
	)

	request_handlers[ServerHeaders.Headers.DISCONNECT_CHARACTER] = Callable(
		disconnect_character, "handle"
	)

	request_handlers[ServerHeaders.Headers.CHAT_MESSAGE] = Callable(
		chat, "handle"
	)


func handle_message(message: ServerMessage, scene_tree: SceneTree) -> void:
	var message_id: int = message.get_id()
	var alert_ui: AlertUI = AlertUI.new()

	if request_handlers.has(message_id):
		var handler: Callable = request_handlers[message_id]

		if handler.is_valid():
			handler.call(scene_tree, message)
		else:
			alert_ui.show_alert(scene_tree, 'Erro ao processar a mensagem...')
