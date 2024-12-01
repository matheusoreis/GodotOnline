class_name ChatOutgoing extends ClientMessage


func _init(channel: int, message: String) -> void:
	super._init(ClientHeaders.Headers.CHAT_MESSAGE)

	put_string(Globals.account_token)
	put_int8(channel)
	put_string(message)
