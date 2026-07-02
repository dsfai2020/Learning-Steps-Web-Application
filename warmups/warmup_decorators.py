import unittest

def my_decorator(func):
	# The args are any positional data.  kwargs are 2 pair
	def my_wrapper(*positionals, **pairs):
		print('do something first')
		func(*positionals, **pairs)
		print('do something after')
	return my_wrapper


@my_decorator
def order_drink(drink):
	print(f'ordering one {drink}')



order_drink('coffee')