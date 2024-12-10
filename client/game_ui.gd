extends CanvasLayer

@export_category('Referências')
@export var chat_ui: ChatUI
@export var character_data_ui: CharacterDataUI
@export var inventory_ui: InventoryUI


func _input(event):
	if event.is_action_pressed("toggle_chat"):
		if chat_ui.visible:
			chat_ui.hide()
		else: 
			chat_ui.show()

	if event.is_action_pressed("toggle_character_data"):
		if character_data_ui.visible:
			character_data_ui.hide()
		else: 
			CharacterDataOutgoing.new().send()

	if event.is_action_pressed("toggle_inventory"):
		if inventory_ui.visible:
			inventory_ui.hide()
		else: 
			inventory_ui.show()
