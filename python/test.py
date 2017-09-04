#!/usr/bin/python
# -*- coding: UTF-8 -*-
class Car:
   '所有员工的基类'
   age = 0
   #构造方法,self-实例
   def __init__(self, name, salary):
      self.name = name
      self.salary = salary
      Car.age += 1
   
   def displayCount(self):
     print "Total Car %d" % Car.age

   def displayEmployee(self):
      print "Name : ", self.name,  ", Salary: ", self.salary
car=Car("mill",1800)
car.displayCount()