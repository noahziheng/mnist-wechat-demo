#!/bin/bash
export TF_CPP_MIN_LOG_LEVEL=2
gunicorn main:app --log-file=-