const botSettings = require("./botsettings.json");
let DB = require('./DB.json');

const Discord = require("discord.js");
const fs = require('fs');

const prefix = botSettings.prefix;

const client = new Discord.Client({disableEveryone: true});

//DB에서 입력한 보스이름 찾기
function findBossName(arr, name) {
    return arr.filter(function(item) {
        return item.name === name;
    })[0];
}

client.on("ready", () => {
    console.log(`Bot is ready! ${client.user.username}`);
})

client.on("message", (message) => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    var messageArray = message.content.split(" ");
    var command = messageArray[0];

    if(!command.startsWith(prefix)) return;

        if (command === `${prefix}컷`) {
        try {
            var now = new Date();
            var DateNow = "";
            var Hours = now.getHours();
            var mins = ('0' + now.getMinutes()).slice(-2);

            console.log('현재시간 : ' + ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2) + ':' + ('0' + now.getSeconds()).slice(-2));

            var newData = {
                "name": messageArray[1],
            };

            var item = findBossName(DB.raid, newData.name);
            var PlusTime = item.plusTime;
            var PlusM = item.plusM;

            //console.log(PlusTime, PlusM);

            //24시가 넘으면 0시부터 계산 + 10시 미만이면 앞에 0을 추가
            if ((Number(Hours) + Number(PlusTime)) >= 24) {
            	if(messageArray[1] == "피닉스") {
				if((now.getMinutes() + Number(PlusM)) >= 60) {
					mins = ('0' + (now.getMinutes() - 7)).slice(-2);
            			DateNow = '0' + ((Number(Hours) + Number(PlusTime)) - 23) + mins;
            		}
            		else {
            			mins = now.getMinutes() + Number(PlusM);
            			DateNow = '0' + ((Number(Hours) + Number(PlusTime)) - 24) + mins;
            		}
            	}
            	else {
            		DateNow = '0' + ((Number(Hours) + Number(PlusTime)) - 24) + mins;
            	}
            }
            else if((Number(Hours) + Number(PlusTime)) < 10){
                	if(messageArray[1] == "피닉스") {
                		if((now.getMinutes() + Number(PlusM)) >= 60) {
                			mins = ('0' + (now.getMinutes() - 7)).slice(-2);
                			if((Number(Hours) + Number(PlusTime)) >= 9) {
                				DateNow = ('' + (Number(Hours) + Number(PlusTime) + 1)) + mins;
                			}
                			else {
                				DateNow = ('0' + (Number(Hours) + Number(PlusTime) + 1)) + mins;
                			}
            		}
            		else {
            			mins = now.getMinutes() + Number(PlusM);
            			DateNow = ('0' + (Number(Hours) + Number(PlusTime))) + mins;
            		}
            	}
            	else {
            		DateNow = ('0' + (Number(Hours) + Number(PlusTime))) + mins;
            	}
            }
            else {
            	if(messageArray[1] == "피닉스") {
                		if((now.getMinutes() + Number(PlusM)) >= 60) {
                			mins = ('0' + (now.getMinutes() - 7)).slice(-2);
                			if ((Number(Hours) + Number(PlusTime)) >= 23) {
                				DateNow = '0' + ((Number(Hours) + Number(PlusTime)) - 23) + mins;
                			}
                			else {
            				DateNow = ('' + (Number(Hours) + Number(PlusTime) + 1)) + mins;
            			}
            		}
            		else {
            			mins = now.getMinutes() + Number(PlusM);
            			DateNow = ('' + (Number(Hours) + Number(PlusTime))) + mins;
            		}
            	}
            	else {
            		DateNow = ('' + (Number(Hours) + Number(PlusTime))) + mins;
            	}
            }
            
		//console.log("계산시간 :",DateNow);

            var newData = {
                "name": messageArray[1],
                "value": DateNow
            };

            var item = findBossName(DB.raid, newData.name);
            item.value = newData.value;

            console.log(item);

            //정렬
            DB.raid.sort(function (a, b) {
                return a.value < b.value ? -1 : a.value > b.value ? 1 : 0;
            });
            
            message.channel.send(`${messageArray[1]} 컷 체크 완료!`);
            //console.log(JSON.stringify(DB.raid, null, 4));
    
    	
        
        	fs.writeFile('./DB.json', JSON.stringify(DB, null, 4), function(err) {
           		if(err) return console.log(err);
            	console.log('Save Done');
        });
	}
        catch (e) {
            messageArray[2] = 'Undefined';
            message.channel.send("오류 : 명령어를 정확히 입력해주세요");
        }
    }

    if(command === `${prefix}수정`){
        try {
            var newData = {
                "name": messageArray[2],
                "value": messageArray[1]
            };

            var item = findBossName(DB.raid, newData.name);
            item.value = newData.value;
            
            //정렬
            DB.raid.sort(function(a, b){
                return a.value < b.value ? -1 : a.value > b.value ? 1 : 0;
            });
            
            message.channel.send("수정 체크 완료!");
            //console.log(JSON.stringify(messageArray));
             
            console.log(item);
           
	
       	fs.writeFile('./DB.json', JSON.stringify(DB, null, 4), function(err) {
           		if(err) return console.log(err);
           		console.log('Save Done');
        	});
        	
        }
        
        
    		
        catch (e) {
            messageArray[2] = 'Undefined';
            message.channel.send("오류 : 명령어를 정확히 입력해주세요");
        }
    }

    if (command === `${prefix}뻥`) {
        try {
		
            var newData = {
                "name": messageArray[1],
            };
            
            var item = findBossName(DB.raid, newData.name);
            var PlusTime = item.plusTime;
            var PlusM = item.plusM;
            var listTime = item.value;
            var mins = ('0' + Number(listTime)).slice(-2);

            // var NewTime_H = Number(listTime).slice(0, -2);
            // var NewTime_M = Number(listTime).slice(2);

            // console.log("시간:",NewTime_H,"분:",NewTime_M);

            var NewTime = Number(listTime) + (Number(PlusTime) * 100);
            
             if(messageArray[1] == "피닉스") {
            	if((Number(mins) + Number(PlusM)) >= 60) {
                		NewTime = (Number(NewTime) + 93);
                	}
                	else {
                		NewTime = (Number(NewTime) + 53);
                	}
            }

            if(Number(NewTime) >= 2400 && Number(NewTime) < 2410) {
                 NewTime = '000' + (Number(NewTime) - (24 * 100));
            }
            else if(Number(NewTime) >= 2410 && Number(NewTime) < 2500) {
                 NewTime = '00' + (Number(NewTime) - (24 * 100));
            } 
            else if(Number(NewTime) >= 2500) {
                 NewTime = '0' + (Number(NewTime) - (24 * 100));
            } 
            else if( Number(NewTime) < 1000 ) {
                 NewTime = '0' + Number(NewTime);
            }
            
            console.log(messageArray[1], listTime);
            console.log(messageArray[1], NewTime);
 
            var newData = {
                "name": messageArray[1],
                "value": String(NewTime)
            };

            var item = findBossName(DB.raid, newData.name);
            item.value = newData.value;

            //정렬
            DB.raid.sort(function (a, b) {
                return a.value < b.value ? -1 : a.value > b.value ? 1 : 0;
            });
            
            message.channel.send(`${messageArray[1]} 뻥 체크 완료!`);
            //console.log(JSON.stringify(DB.raid, null, 4));
            
            
            
      	fs.writeFile('./DB.json', JSON.stringify(DB, null, 4), function(err) {
           		if(err) return console.log(err);
           		console.log('Save Done');
		});
    }
        catch (e) {
            messageArray[2] = 'Undefined';
            message.channel.send("오류 : 명령어를 정확히 입력해주세요");
        }
    }

    if(command === `${prefix}목록`) {
        DB.raid.sort(function(a, b){
            return a.value < b.value ? -1 : a.value > b.value ? 1 : 0;
        });

        const BossArray = [];

        for(var i=0; i<25; i++) {
            if(DB.raid[i].value !== "x")
                BossArray[i] = DB.raid[i].name + (DB.raid[i].name.length == 1 ? "\t\t\t\t" : (DB.raid[i].name.length == 2) ? "\t\t\t" : "\t\t") + DB.raid[i].value
        }
        
        message.channel.send(BossArray);

        console.log(JSON.stringify(BossArray,null,4));
    }
    
    if(command === `${prefix}목록1`) {
        DB.raid.sort(function(a, b){
            return a.value < b.value ? -1 : a.value > b.value ? 1 : 0;
        });

        const BossArray = [];

        for(var i=0, j=0; i<25; i++) {
            if((DB.raid[i].value !== "x") && (DB.raid[i].type == "1")) {
                BossArray[j] = DB.raid[i].name + (DB.raid[i].name.length == 1 ? "\t\t\t\t" : (DB.raid[i].name.length == 2) ? "\t\t\t" : "\t\t") + DB.raid[i].value;
        	   j++;
        	}
    	 }
    	
        message.channel.send(BossArray);

        console.log(JSON.stringify(BossArray,null,4));
    }
    
    if(command === `${prefix}목록2`) {
        DB.raid.sort(function(a, b){
            return a.value < b.value ? -1 : a.value > b.value ? 1 : 0;
        });

        const BossArray = [];

        for(var i=0, j=0; i<25; i++) {
        	if((DB.raid[i].value !== "x") && (DB.raid[i].type == "2")) {
                BossArray[j] = DB.raid[i].value + (DB.raid[i].name.length == 1 ? " " : (DB.raid[i].name.length == 2) ? " ":" ") + DB.raid[i].name;
                j++;
            }
        }
        
        message.channel.send(BossArray);

        console.log(JSON.stringify(BossArray,null,4));
    }

    if(command === `${prefix}help`){
        message.channel.send("-설명\n-명령어 : !컷, !수정, !목록\n-!컷 [보스이름] : !컷 [보스이름] 입력시 그 보스 현재시간과 젠시간을 합산하여 목록에 저장합니다\n- !수정 : !수정 [시간] [보스이름]\nex)!수정 1514 거드\n- '!목록' : 현재 저장된 목록을 보여줌\n'!초기화' : 모든 보스타임을 삭제한다 (완료시 메세지가 서버에만 출력됨 되도록이면 리딩이 아니면 사용금지)\n!뻥 : 현재 목록에 출력되는 시간 + 보스의 리젠주기를 추가합니다");
    }

    if(command === `${prefix}저장`) {
        fs.writeFile('./DB.json', JSON.stringify(DB, null, 4), function(err) {
            if(err) return console.log(err);
            console.log('Save Done');
        })
    }

    if(command === `${prefix}초기화`) {
        for(var i=0; i<25; i++) {
            DB.raid[i].value = "x"
        }

        console.log('초기화 완료');
    }
    
    if(command === `${prefix}초기화1`) {
    	 for(var i=0; i<25; i++) {
        	if(DB.raid[i].type == "1") {
                DB.raid[i].value = "x"
            }
        }
        
        console.log('초기화1 완료');
    }
    
    if(command === `${prefix}초기화2`) {
        for(var i=0; i<25; i++) {
        	if(DB.raid[i].type == "2") {
                DB.raid[i].value = "x"
            }
        }

        console.log('초기화2 완료');
    }

    if(command === `${prefix}테스트`) {
        if (message.content.startsWith(prefix)) {
            message.delete(10); //Supposed to delete message
        }
    }

    // //알림
     //var now = new Date();
     //var DateNow = "";
     //var Hours = (now.getHours() < 10 ? '0' + now.getHours() : now.getHours() );
     //var mins = ('0' + now.getMinutes()).slice(-2);

     //if ((Number(DB.raid[0].value) - Number(Hours + mins) == 1) && DB.raid[0].name == "개미" ) {
     //    message.channel.send(`@here ${DB.raid[0].name} 1분전`,{tts: true});
	//}

});

client.login(botSettings.token);