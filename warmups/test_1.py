import pytest
import requests

def setup_config():
	setup_config='ready'
	print("Configuration is setup")
	return setup_config
	
def my_decorator(func):
	def my_wrapper(*x, **y):
		print('Setting up')
		func(*x, **y)
		print('Tearing Down...')
	return my_wrapper

def a_decorator(the_test):
	def test_wrapper(x=False):
		print('Setting up your environment variables...')
		setup_config()
		the_test()
		print('Tearing Down...')
	return test_wrapper



@my_decorator
def test_stream(a,b):
	return a+b

def test_the_stream():
    assert 9>10, "failed"

@a_decorator
def test_ping():
	response = requests.get('https://api.github.com/events')
	assert response.status_code ==400, 'should be 200'

@a_decorator
def test_bloodwork():
	assert 5>9, "5 must be greater than 9"

@a_decorator
def test_checkin(user_auth):
	assert user_auth is True, 'User is not authorized.'