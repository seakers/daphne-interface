// initial state
const state = {
    features: [],
    supportThreshold: 0.002,
    confidenceThreshold: 0.2,
    liftThreshold: 1
};

// getters
const getters = {
    getFeatures(state) {
        return state.features;
    }
};

// actions
const actions = {
    async getDrivingFeatures({ state, commit, rootState }) {
        try {
            let reqData = new FormData();
            // Generate list of selected and not selected point ids
            let selectedIds = [];
            let nonSelectedIds = [];
            rootState.tradespacePlot.selectedArchs.forEach((point, index) => {
                if (point) {
                    selectedIds.push(index);
                }
                else {
                    nonSelectedIds.push(index);
                }
            });
            reqData.append('selected', JSON.stringify(selectedIds));
            reqData.append('non_selected', JSON.stringify(nonSelectedIds));
            reqData.append('supp', state.supportThreshold);
            reqData.append('conf', state.confidenceThreshold);
            reqData.append('lift', state.liftThreshold);
            let dataResponse = await fetch(
                '/api/data-mining/get-driving-features/',
                {
                    method: 'POST',
                    body: reqData,
                    credentials: 'same-origin'
                }
            );

            if (dataResponse.ok) {
                let data = await dataResponse.json();
                if (data === []) {
                    alert('No driving features mined. Please try modifying the selection. (Try selecting more designs)');
                }
                commit('setFeatures', data);
            }
            else {
                console.error('Error obtaining the driving features.');
            }
        }
        catch(e) {
            console.error('Networking error:', e);
        }
    }
};

// mutations
const mutations = {
    setFeatures(state, features) {
        state.features = features;
    },
    addFeature(state, feature) {
        state.features.push(feature);
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}
