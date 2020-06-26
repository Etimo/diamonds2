#!/bin/bash

# Restarts AWS instance and changes the instance type
# Instance type will be changed to t2.micro if current season is "Off season"
# The instance type will be t2.small if another season is active.


# Using this function to remove double quotes from strings
remove_double_quotes() {
    echo $(sed -e 's/^"//' -e 's/"$//' <<<"$1")
}

fetch_status() {
    instance_info=$(aws ec2 describe-instances --instance-ids  $instance_id --query "Reservations[*].Instances[*].{Status:State.Name,Instancetype:InstanceType}")
    status=$(jq '.[0][0].Status' <<< $instance_info)
    status=$(remove_double_quotes "$status")
}

# We might need to load env variables (DIAMONDS_AWS_INSTANCE_ID)

off_season="Off season"
instance_type_micro="t2.micro"
instance_type_small="t2.small"
instance_id=$DIAMONDS_AWS_INSTANCE_ID

if [ -z "$instance_id" ]; then
    echo "Instance id not found"
    exit 1
fi


# Get instance type
instance_info=$(aws ec2 describe-instances --instance-ids  $instance_id --query "Reservations[*].Instances[*].{Status:State.Name,Instancetype:InstanceType}")
instance_type=$(jq '.[0][0].Instancetype' <<< $instance_info)
instance_type=$(remove_double_quotes "$instance_type")
echo "InstanceType is $instance_type"


# Fetch current_seanson. 
response=$(curl http://diamonds.etimo.se/api/seasons/current)
current_season=$(jq '.data.name'  <<< $response)
current_season=$(remove_double_quotes "$current_season")

if [ "$current_season" == "$off_season" ]; then
    new_instance_type=$instance_type_micro
else
    new_instance_type=$instance_type_small
fi

# Set to always micro - Testing
new_instance_type=$instance_type_small

echo "InstanceType should be $new_instance_type"


# Exit if the type is the same
if [ "$instance_type" == "$new_instance_type" ]; then
    echo "Type is same, exiting cronjob"
    exit 1;
fi




echo "Current type: $instance_type"
echo "New type: $new_instance_type"

new_instance_type=$instance_type_micro

# Stop instance
echo "Stopping instance"
aws ec2 stop-instances --instance-ids $instance_id



# Control that the instance is stopped!
fetch_status

#Waiting for the instance to be stopped. (total 100sec)
sleeps=0
while [ "$status" != "stopped" ]
do
    echo $status
    sleep 20
    sleeps=$((sleeps + 1))
    fetch_status
    if [ "$sleeps" == 5 ]; then exit 1; fi
done


echo "$status"
echo "Instance is stopped!"
        
# Change instance type
aws ec2 modify-instance-attribute --instance-id $instance_id --instance-type "{\"Value\": \"$new_instance_type\"}"
echo "Instance type changed to $new_instance_type"

# Not checking if instance type is correct because we need to start the instance again anyway!

# Start instance
aws ec2 start-instances --instance-ids $instance_id
echo "Instance started again"

