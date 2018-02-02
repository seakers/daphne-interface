export default class TradespacePlot {
    /*
        Counts the number of both selected and highlighted archs
        @return: the number of dots selected
    */
    get_num_of_highlighted_archs() {
        let num = 0;
        this.data.forEach(point => {
            if (point.highlighted) {
                num++;
            }
        });
        return num;
    }


    /*
        Counts the number of both selected and highlighted archs
        @return: the number of dots selected
    */
    get_num_of_intersected_archs() {
        let num = 0;
        this.data.forEach(point => {
            if (point.selected && point.highlighted) {
                num++;
            }
        });
        return num;
    }
}
