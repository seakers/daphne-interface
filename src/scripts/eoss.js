"use strict";

class Architecture {
    constructor(id, inputs, outputs) {
        this.id = id;
        this.inputs = inputs;
        this.outputs = outputs; 
    }
}

class EOSS extends Problem {
    constructor(context) {
        // Set the problem instance
        super(
            "EOSS_data.csv",
            60,
            2,
            [],
            ['Science','Cost'],
            [1,-1],
            async (data) => {
                [this.orbit_list, this.instrument_list] = await Promise.all([this.get_orbit_list(), this.get_instrument_list()]);
                this.orbit_num = this.orbit_list.length;
                this.instrument_num = this.instrument_list.length;
                PubSub.publishSync(DATA_PROCESSED, this.preprocessing(data));
            }
        );

        // Initialize the member attributes 
        this.orbit_list = [];
        this.instrument_list = [];
        this.orbit_num = null;
        this.instrument_num = null;

        this.context = context;

        PubSub.subscribe(ARCH_SELECTED, (msg, arch) => {
            this.display_arch_info(arch);
        });
    }

    /*
    Returns the list of orbits
    @return orbitList: a string list containing the names of orbits
    */
    async get_orbit_list() {
        try {
            let data_response = await fetch('/api/vassar/get-orbit-list/');
            if (data_response.ok) {
                return data_response.json();
            }
            else {
                console.error("Error getting the orbit list");
            }
        }
        catch(e) {
            console.error("Networking error:", e);
        }
    }
    

    /*
    Returns the list of instruments
    @return instrumentList: a string list containing the names of instruments
    */
    async get_instrument_list() {
        try {
            let data_response = await fetch('/api/vassar/get-instrument-list/');
            if (data_response.ok) {
                return data_response.json();
            }
            else {
                console.error("Error getting the instrument list");
            }
        }
        catch(e) {
            console.error("Networking error:", e);
        }
    }
    
    
    booleanArray2String(boolArray) {
        let bitString = "";
        for (let i = 0; i < boolArray.length; i++) {
            let bool;
            if (boolArray[i] === true) {
                bool = 1;
            } else {
                bool = 0;
            }
            bitString = bitString + bool;
        }
        return bitString;
    }


    string2BooleanArray(bitString) {
        let boolArray = [];
        boolArray.length = 0;
        for (let i = 0; i < bitString.length; i++) {
            if (bitString.charAt(i) == "1") {
                boolArray.push(true);
            } else {
                boolArray.push(false);
            }
        }
        return boolArray;
    }
    
    
    preprocessing(data) {
        let output = [];
        data.forEach(d => {
            // convert string to numbers
            d.science = Number(d.science);
            d.cost = Number(d.cost);
            if (d.cost == 100000) {
                d.cost = 0;
                d.science = 0;
            }
            let outputs = d.outputs;
            let inputs = d.inputs;
            let id = +d.id;
            
            let arch = new Architecture(id, inputs, outputs);

            output.push(arch);
        });
        
        return output;
    }


    display_arch_info(data) {
        let bitString = this.booleanArray2String(data.inputs);
        let json_arch = [];
        
        for (let i = 0; i < this.orbit_num; i++) {
            let orbit = this.orbit_list[i];
            let assigned = [];
            
            for (let j = 0; j < this.instrument_num; j++) {
                if (bitString[i*this.instrument_num + j] == '1') {
                    let instrument = this.instrument_list[j];
                    //Store the instrument names assigned to jth orbit
                    assigned.push(instrument);
                }
            }
            // Store the name of the orbit and the assigned instruments
            json_arch.push({ "orbit": orbit, "children": assigned });
        }        
    
        
        let norb = json_arch.length;
        let maxNInst = 0;
        let totalNInst = 0;

        for (let i = 0; i < this.orbit_num; i++) {
            let nInst = json_arch[i].children.length;
            totalNInst = totalNInst + nInst;
            if (nInst > maxNInst) {
                maxNInst = nInst;
            }
        }

        d3.select("#design_inspector > .panel-block").select("g").select("table").remove();

        let design_inspector = d3.select("#design_inspector > .panel-block").select("g");
        let table = design_inspector.append("table")
            .attr("id", "arch_info_display_table")
            .attr("class", "table");

        let columns = [];
        columns.push({ columnName: "orbit" });
        
        for (let i = 0; i < maxNInst; i++) {
            let tmp = i + 1;
            columns.push({ columnName: "Inst " + tmp });
        }

        // create table header
        table.append('thead').append('tr')
            .selectAll('th')
            .data(columns)
            .enter()
            .append('th')
            .text(d => d.columnName);


        // create table body
        let rows = table.append('tbody')
            .selectAll("tr")
            .data(json_arch);

        let rows_headers = rows.enter()
            .append("tr")
            .attr("name", d => d.orbit)
            .selectAll("th")
            .data((row, i) => {
                return [{ type: "orbit", content: json_arch[i].orbit }];
            });

        rows_headers.enter()
            .append("th")
            .attr("name", d => d.content)
            .attr("class", "arch_cell")
            .text(d => this.context.label.actualName2DisplayName(d.content, "orbit"));

        let rows_cells = table.select("tbody").selectAll("tr")
            .selectAll("td")
            .data((row, i) => {
                let thisRow = [];
                for (let j = 0; j < json_arch[i].children.length; j++) {
                    let instObj = { type: "instrument", content: json_arch[i].children[j], orbit: json_arch[i].orbit };
                    thisRow.push(instObj);
                }
                for (let j = json_arch[i].children.length; j < maxNInst; j++) {
                    let instObj = { type: "instrument", content: "", orbit: json_arch[i].orbit };
                    thisRow.push(instObj);
                }
                return thisRow;
            });
        
        rows_cells.enter()
            .append("td")
            .attr("name", d => d.content)
            .attr("class", "arch_cell")
            .text(d => this.context.label.actualName2DisplayName(d.content, "instrument"));
    }
}