import chai from 'chai';
import chaiHttp from 'chai-http';
import Dao from "../src/service/dao.js";
// import deepEqualInAnyOrder from 'deep-equal-in-any-order';
// import {strict as assert} from 'assert';
const should = chai.should;
const expect = chai.expect;
should();
chai.use(chaiHttp);
// chai.use(deepEqualInAnyOrder);


const testPlan = {
    getAndSet: false,
    reset: false,
    suggestVolcano: true
};

let dao;

describe('dao test ', () => {

    before(() => {
        console.info("pantry test :: before");
        dao = new Dao();
    });
    after(async () => {
        console.info("pantry test :: after");
        console.info(await dao.getContext());
    });

    testPlan.getAndSet &&
    it('getAndSet: should get and set volcanoes', async () => {
        let payload = {"oo": "great"};
        const setResult = await dao.setVolcanoes(payload).catch(_expectNoError);
        setResult.should.contains("Your Pantry was updated with basket: ");
        const current = await dao.getVolcanoes().catch(_expectNoError)
        expect(current).to.be.eql(payload);
    });

    testPlan.reset &&
    it('reset: should reset and get current static version as fallback', async () => {
        const setResult = await dao.setVolcanoes(null).catch(_expectNoError);
        setResult.should.contains("was removed from your Pantry!");
        const current = await dao.getVolcanoes().catch(_expectNoError);
        expect(current.length).to.be.gte(9);
    });

    testPlan.suggestVolcano &&
    it('suggestVolcano: should suggest a new volcano and add it', async () => {
        const suggestsBefore = await dao.getSuggests().catch(_expectNoError);
        let suggestedVolcano = {"volcano_id":"theNewOne", "name": "Ooo wouahou !"};
        const id = await dao.suggestNewVolcano(suggestedVolcano).catch(_expectNoError);
        expect(id).not.to.be.empty;
        const suggestsAfter = await dao.getSuggests().catch(_expectNoError);
        expect(countSuggestByKey(suggestsAfter, "suggestVolcanoes")).to.be.eql(countSuggestByKey(suggestsBefore, "suggestVolcanoes") + 1);
        expect(suggestsAfter["suggestVolcanoes"][id]).not.to.be.empty;
        const accept = await dao.acceptSuggestVolcano(id).catch(_expectNoError);
        console.log(accept)
    });

    // we dont duplicate the test for suggestLive

    function countSuggestByKey(edit, key) {
        return edit && edit[key] ? Object.keys(edit[key]).length : 0;
    }
    function _expectNoError(err) {
        console.trace();// print stack
        // var stack = new Error().stack
        // console.log( stack )
        expect.fail(err);
    }
});
