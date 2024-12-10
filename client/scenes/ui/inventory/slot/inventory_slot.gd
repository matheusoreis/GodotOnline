extends Panel

@onready var itemSprite: Sprite2D = $sprite


func update(item: InventoryItem):
	if !item:
		itemSprite.hide()
	else:
		itemSprite.show()
		itemSprite.texture = item.texture
