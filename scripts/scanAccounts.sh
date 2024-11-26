#!/bin/bash

aws dynamodb scan \
    --table-name AccountsTable \
    --endpoint http://localhost:8000