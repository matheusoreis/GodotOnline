class_name InventoryUI extends PanelContainer

@onready var inventory: Inventory = preload("res://scenes/ui/inventory/resources/inventory.tres")
@onready var slots: Array = $design_vbox/content_control/inventory_grid.get_children()


func _ready() -> void:
	update()


func update():
	for i in range(min(inventory.items.size(), slots.size())):
		slots[i].update(inventory.items[i])
	


func _on_close_button_pressed() -> void:
	self.hide()
