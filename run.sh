#!/bin/bash

if [ -z "$1" ]; then
  echo "错误: 作为参数输入URL."
  echo "用法: ./run.sh <URL>"
  exit 1
fi

mkdir -p downloads

node index.js "$1"
