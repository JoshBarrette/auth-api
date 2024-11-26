#!/bin/bash

aws dynamodb scan \
    --table-name SessionsTable \
    --endpoint http://localhost:8000