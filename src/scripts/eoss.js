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
            "EOSS_data_recalculated.csv",
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

        let orbitAliasArray = [["LEO-600-polar-NA", "1"], ["SSO-600-SSO-AM", "2"], ["SSO-600-SSO-DD", "3"], ["SSO-800-SSO-DD", "4"], ["SSO-800-SSO-PM", "5"]];
        this.orbitAlias = new Map(orbitAliasArray);
        let instrumentAliasArray = [["ACE_ORCA", "A"], ["ACE_POL", "B"], ["ACE_LID", "C"], ["CLAR_ERB", "D"], ["ACE_CPR", "E"], ["DESD_SAR", "F"], ["DESD_LID", "G"], ["GACM_VIS", "H"], ["GACM_SWIR", "I"], ["HYSP_TIR", "J"], ["POSTEPS_IRS", "K"],["CNES_KaRIN", "L"]];
        this.instrumentAlias = new Map(instrumentAliasArray);
        
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
            let data_response = await fetch("/api/vassar/get-orbit-list/", {credentials: "same-origin"});
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
            let data_response = await fetch("/api/vassar/get-instrument-list/", {credentials: "same-origin"});
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
            arch.orig_inputs = inputs;

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

        d3.select(".design_inspector > .panel-block").select("g").select("table").remove();

        let design_inspector = d3.select(".design_inspector > .panel-block").select("g");
        let design_space = design_inspector
            .append("div")
            .classed("design_space", true);

        let table = design_space
            .append("table")
            .attr("id", "arch_info_display_table")
            .attr("class", "table");

        let columns = [];
        columns.push({ columnName: "Orbit" });
        columns.push({ columnName: "Instruments" });
        
        /*for (let i = 0; i < maxNInst; i++) {
            let tmp = i + 1;
            columns.push({ columnName: "Inst " + tmp });
        }*/

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
                return [{ type: "orbit", content: this.orbitAlias.get(json_arch[i].orbit) }];
            });

        rows_headers.enter()
            .append("th")
            .attr("name", d => d.content)
            .attr("class", "arch_cell")
            .text(d => d.content);

        let rows_cells = table.select("tbody").selectAll("tr")
            .append("td")
            .append("div")
            .classed("instruments_list", true)
            .selectAll("div")
            .data((row, i) => {
                let thisRow = [];
                for (let j = 0; j < json_arch[i].children.length; j++) {
                    let instObj = { type: "instrument", content: this.instrumentAlias.get(json_arch[i].children[j]), orbit: json_arch[i].orbit };
                    thisRow.push(instObj);
                }
                /*for (let j = json_arch[i].children.length; j < maxNInst; j++) {
                    let instObj = { type: "instrument", content: "", orbit: json_arch[i].orbit };
                    thisRow.push(instObj);
                }*/
                return thisRow;
            });
        
        rows_cells.enter()
            .append("div")
            .attr("name", d => d.content)
            .attr("class", "arch_box")
            .text(d => d.content);

        // Add list of instruments
        let instruments_list = design_space
            .append("div")
            .attr("id", "instrument_adder_list")
            .style("margin-left", "40px")
            .style("max-width", "70px")
            .selectAll("div")
            .data(this.instrument_list)
            .enter()
            .append("div")
            .classed("arch_box", true)
            .text(d => this.instrumentAlias.get(d));

        let instrument_adder_list = document.getElementById('instrument_adder_list');
        Sortable.create(instrument_adder_list, {
            group: {
                name: 'instrument_adders',
                pull: 'clone',
                put: 'instrument_lists'
            },
            sort: false,
            animation: 150,
            onAdd: e => {
                e.item.parentNode.removeChild(e.item);
            }
        });

        let table_instrument_rows = document.getElementsByClassName('instruments_list');
        Array.prototype.forEach.call(table_instrument_rows, (elem, idx) => {
            Sortable.create(elem, {
                group: {
                    name: 'instrument_lists',
                    pull: true,
                    put: ["instrument_lists", "instrument_adders"]
                },
                onAdd: e => {
                    let dragged_instr = $(e.item).text();
                    let count = 0;
                    $(e.item.parentNode).children(".arch_box").each((index, element) => {
                        if (dragged_instr === $(element).text()) {
                            count++;
                        }
                    });
                    if (count > 1) {
                        e.item.parentNode.removeChild(e.item);
                    }
                },
                animation: 150,
            });
        });

        function boolArch(instrument_num) {
            let bitString = [];
            for (let i = 0; i < 60; i++) {
                bitString.push(false);
            }

            for (let i = 0; i < table_instrument_rows.length; ++i) {
                $(table_instrument_rows[i]).children(".arch_box").each((index, element) => {
                    let position = $(element).text().charCodeAt() - "A".charCodeAt();
                    bitString[instrument_num*i + position] = true;
                });
            }

            return bitString;
        }

        $("#evaluate-arch").on("click", async e => {
            let req_data = new FormData();
            req_data.append("inputs", JSON.stringify(boolArch(this.instrument_num)));
            console.log(boolArch(this.instrument_num));
            try {
                let data_response = await fetch("/api/vassar/evaluate-architecture/", 
                    {
                        method: "POST",
                        body: req_data,
                        credentials: "same-origin"
                    });
                if (data_response.ok) {
                    let eval_response = await data_response.json();
                    PubSub.publish(ARCH_ADDED, eval_response);
                }
                else {
                    console.error("Error evaluating the architecture");
                }
            }
            catch(e) {
                console.error("Networking error:", e);
            }
        });
    }
}