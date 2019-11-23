const execSync = require('child_process').execSync;
const Loading = require("./js/loading");

var sudo = require('sudo-prompt');
var options = {
    name: 'electroscan'
    // icns: '/Applications/Electron.app/Contents/Resources/Electron.icns', // (optional)
};

var host = {ip: null, netmask: -1};
var data = [];

var loading = new Loading();

const NO_NAME = "None";


function getBitsNumber(hexString){
    var bitNum = 0;

    var lastF = hexString.lastIndexOf("f") - 1; // index 0 = '0', index 1 = 'x' in string '0xffffff00'
    bitNum += 4 * lastF;

    if(lastF < hexString.length - 1){
        var char = hexString[lastF + 1];
        switch (char) {
            case '1': bitNum += 1; break;
            case '2': bitNum += 2; break;
            case '3': bitNum += 3; break;
            case '4': bitNum += 4; break;
            case '5': bitNum += 5; break;
            case '6': bitNum += 6; break;
            case '7': bitNum += 7; break;
            case '8': bitNum += 8; break;
            case '9': bitNum += 9; break;
            case 'a': bitNum += 10; break;
            case 'b': bitNum += 11; break;
            case 'c': bitNum += 12; break;
            case 'd': bitNum += 13; break;
            case 'e': bitNum += 14;
        }
    }

    return bitNum;
}

function getNetworkInfo(){
    var stdout = execSync('ifconfig | grep \"inet \"').toString();

    // IP
    // The first index of netmask is loopback 127.0.0.1
    var indexOfIp = stdout.lastIndexOf("inet") + "inet ".length;
    var ip = stdout.slice(indexOfIp, stdout.lastIndexOf(' netmask '));

    // NETMASK
    // The first index of netmask is loopback 127.0.0.1
    var indexOfNetmask = stdout.lastIndexOf("netmask") + "netmask ".length;
    var netmaskBitsNumber = getBitsNumber(stdout.slice(indexOfNetmask, indexOfNetmask + 11)); // Netmask's size is 10

    host.ip = ip;
    host.netmask = netmaskBitsNumber;
}

function getData(host){
    sudo.exec('nmap -sn -sP -n ' + host.ip + '/' + host.netmask, options,
        function(error, stdout, stderr) {
            if (error){
                alert(error);
                data.push({ip: host.ip, mac: "", vendor: "", name: ""});
                done(data);
                return;
            }

            var out = stdout.toString();

            const IP_PHRASE = "Nmap scan report for ";
            const AFTER_IP = "\nHost is up";
            const MAC_ADDRESS_PHRASE = "MAC Address: ";
            const VENDOR_PHRASE = " (";
            const VENDOR_END = ")\n";
            var index = out.indexOf(IP_PHRASE);
            if(index < 0){
                data.push({ip: host.ip, mac: "", vendor: "", name: ""});
                done(data);
                return;
            }

            out = out.slice(index, out.length);
            index = out.indexOf(IP_PHRASE);
            while(index >= 0){
                out = out.slice(index, out.length);

                var nl = out.indexOf(AFTER_IP);
                var ip = out.slice(IP_PHRASE.length, nl);
                out = out.slice(out.indexOf(MAC_ADDRESS_PHRASE), out.length);
                var mac = out.slice(MAC_ADDRESS_PHRASE.length, out.indexOf(VENDOR_PHRASE));
                out = out.slice(out.indexOf(VENDOR_PHRASE), out.length);
                var vendor = out.slice(VENDOR_PHRASE.length, out.indexOf(VENDOR_END));

                data.push({ip: ip, mac: mac, vendor: vendor});

                index = out.indexOf(IP_PHRASE)
            }

            data.sort(function(a, b){a.ip.localeCompare(b.ip)});

            done(data);
        }
    );
}

function done(data){
    fillTable(data);
    loading.stop();
}

function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
}

function generateTable(table, data) {
    for (let element of data) {
        let row = table.insertRow();
        for (key in element) {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
        }
    }
}

function fillTable(content){
    let table = document.querySelector("table");
    let data = Object.keys(content[0]);
    generateTableHead(table, data);
    generateTable(table, content);
}

loading.start();
getNetworkInfo();
if(host.ip != null){
    getData(host);
}
