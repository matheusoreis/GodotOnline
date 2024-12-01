class_name AccessAccountUI extends PanelContainer


@export_category('Componentes')
@export var email_line: LineEdit
@export var password_line: LineEdit
@export var access_button: Button
@export var create_button: Button

@export_category('Referências')
@export var create_account_ui: PanelContainer
@export var character_list_ui: PanelContainer


func _on_close_button_pressed() -> void:
	Multiplayer.websocket.disconnect_from_host()
	get_tree().quit()


func _on_email_line_text_changed(new_text: String) -> void:
	if _is_valid_email(new_text):
		email_line.remove_theme_color_override("font_color")
	else:
		email_line.add_theme_color_override("font_color", Color.RED)


func _on_password_line_text_changed(new_text: String) -> void:
	if _is_valid_password(new_text):
		password_line.remove_theme_color_override("font_color")
		access_button.disabled = false
	else:
		password_line.add_theme_color_override("font_color", Color.RED)
		access_button.disabled = true


func _is_valid_email(email: String) -> bool:
	var email_regex = RegEx.new()
	email_regex.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
	return email_regex.search(email) != null


func _is_valid_password(password: String) -> bool:
	return password.length() >= 3


func _on_access_button_pressed() -> void:
	AccessAccountOutgoing.new(email_line.text, password_line.text).send()


func _on_create_button_pressed() -> void:
	self.hide()
	create_account_ui.show()
