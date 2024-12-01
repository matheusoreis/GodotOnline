class_name ChatUI extends PanelContainer

@export_category('Componentes')
@export var chat_history: RichTextLabel
@export var chat_options: OptionButton
@export var chat_message: LineEdit
@export var send_message: Button
@export var emotes_panel: Panel


func add_history_message(message: String) -> void:
	chat_history.append_text(message + '\n')


func _on_send_message_pressed() -> void:
	if chat_message.text.length() < 3:
		return;

	ChatOutgoing.new(
		chat_options.get_selected_id(),
		chat_message.text
	).send()


func _on_emotes_button_pressed() -> void:
	if emotes_panel.visible:
		emotes_panel.hide()
	else:
		emotes_panel.show()


func _on_angry_pressed() -> void:
	_send_emote(Globals.Emotes.ANGRY)


func _on_attention_pressed() -> void:
	_send_emote(Globals.Emotes.ATTENTION)


func _on_confused_pressed() -> void:
	_send_emote(Globals.Emotes.CONFUSED)


func _on_idea_pressed() -> void:
	_send_emote(Globals.Emotes.IDEA)


func _on_love_pressed() -> void:
	_send_emote(Globals.Emotes.LOVE)


func _on_music_pressed() -> void:
	_send_emote(Globals.Emotes.MUSIC)


func _on_question_pressed() -> void:
	_send_emote(Globals.Emotes.QUESTION)


func _on_shame_pressed() -> void:
	_send_emote(Globals.Emotes.SHAME)


func _on_sleeping_pressed() -> void:
	_send_emote(Globals.Emotes.SLEEPING)


func _send_emote(emote: int) -> void:
	pass
	#SendEmote.new(emote).send()


func _on_chat_messages_focus_entered() -> void:
	Globals.focus_in_chat = true


func _on_chat_messages_focus_exited() -> void:
	Globals.focus_in_chat = false
