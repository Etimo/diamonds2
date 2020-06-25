#!/bin/bash

# Restarts AWS instance and changes the volume
# Volume will be changed to t2.small if current season is "Off season"
# The volume will be t2.medium if another season is active.


# Using this function to remove double quotes from strings
remove_double_quotes() {
    echo $(sed -e 's/^"//' -e 's/"$//' <<<"$1")
}

off_season="Off season"
volume_small="t2.small"
volume_micro="t2.micro"
instance_id="i-0ae22e94380789482"


# Get instance volume
instance_info=$(aws ec2 describe-instances \
--instance-ids  $instance_id \
--query "Reservations[*].Instances[*].{Status:State.Name,InstanceID:InstanceId,Instancetype:InstanceType}")
instance_volume=$(jq '.[0][0].Instancetype' <<< $instance_info)
instance_volume=$(remove_double_quotes "$instance_volume")


# Fetch current_seanson. 
response=$(curl http://localhost:8080/api/seasons/current) # TODO Change url
current_season=$(jq '.data.name'  <<< $response)
current_season=$(remove_double_quotes "$CURRENT_SEASON")

if [ "$current_season" = "$off_season" ]; then
    volume=$volume_micro
else
    volume=$volume_small
fi

# Exit if the volume is the same
if [ "$instance_volume" = "$volume" ]; then 
    echo "Volume is same, exiting cronjob"
    exit 1; 
fi


echo $instance_volume
echo $volume
exit 1;

exit 1;

# Stop instance
aws ec2 stop-instances --instance-ids $instance_id

## Get instance info
instance_info=$(aws ec2 describe-instances \
--instance-ids  $instance_id \
--query "Reservations[*].Instances[*].{Status:State.Name,InstanceID:InstanceId,Instancetype:InstanceType}")

status=$(jq '.[0][0].Status' <<< $instance_info)
status=$(remove_double_quotes "$status")

#Is the instance still running?
if [ "$status" = "running" ]; then 
    echo "Instance is still running"
    exit 1; 
fi    
        
# Change volume
aws ec2 modify-instance-attribute \
--instance-id $instance_id \
--instance-type "{\"Value\": \"$volume\"}"

# Not checking if volume is correct because we need to start the instance again anyway!

# START INSTANCE
aws ec2 start-instances --instance-ids $instance_id


#Start docker containers! Need to try this!
https://stackoverflow.com/questions/58141265/how-to-auto-restart-a-docker-compose-cluster-when-ec2-instance-reboots
