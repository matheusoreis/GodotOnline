extends PanelContainer


@export_category('Referências')
@export var character_info_ui: PanelContainer
@export var inventory_ui: PanelContainer


func _on_character_button_pressed() -> void:
	if character_info_ui.visible == true:
		character_info_ui.hide()
	else:
		CharacterDataOutgoing.new().send()


func _on_inventory_button_pressed() -> void:
	if inventory_ui.visible == true:
		inventory_ui.hide()
	else:
		inventory_ui.show()


func _on_exit_button_pressed() -> void:
	Multiplayer.websocket.disconnect_from_host()
	get_tree().quit()
