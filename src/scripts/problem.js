"use strict";

class Problem {
    constructor(result_filename, input_num, output_num, input_list, output_list, output_obj, import_callback) {
        this.result_filename = result_filename; // String
        this.input_num = input_num;
        this.output_num = output_num;
        this.input_list = input_list;
        this.output_list = output_list;
        this.output_obj = output_obj; // 1 for lager-is-better, -1 for smaller-is-better
        this.import_callback = import_callback; // Callback function to be called after importing data (preprocessing)
    }
}