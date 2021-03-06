import { expect } from "chai";
import nspell from "nspell";
import NameSpellChecker from "../src/index";

const nameSpellChecker = new NameSpellChecker();

describe("NameSpellChecker", () => {
  describe("constructor", () => {
    it("with args", () => {
      const tempNameSpellChecker = new NameSpellChecker([
        NameSpellChecker.defaultDictionaries.frontEnd,
        {
          aff: "SET UTF-8",
          dic: "2\nname-spell-checker\nname-dic",
        },
        {
          aff: "SET UTF-8",
          dic: "2\njQuery.foo.js\njQuery.bar.js",
        },
      ]);

      expect(tempNameSpellChecker.innerNameMap).to.have.include.keys([
        "vuejs",
        "namespellchecker",
        "namedic",
        "jquerybarjs",
      ]);

      expect(tempNameSpellChecker.nspellInstance).to.be.instanceOf(nspell);
    });

    it("without args", () => {
      const tempNameSpellChecker = new NameSpellChecker();

      expect(tempNameSpellChecker.innerNameMap).to.have.include.keys(["vuejs"]);

      expect(tempNameSpellChecker.nspellInstance).to.be.instanceOf(nspell);
    });
  });

  describe("defaultDictionaries", () => {
    expect(() => {
      (NameSpellChecker.defaultDictionaries as any).foo = "foo";
    }).to.throw(TypeError);
  });

  describe("suggest", () => {
    expect(nameSpellChecker.suggest("vue")).to.include("Vue.js");
    expect(nameSpellChecker.suggest("react")).to.include("React");
    expect(nameSpellChecker.suggest("anguler")).to.include("Angular");
    expect(nameSpellChecker.suggest("query")).to.include("jQuery");
    expect(nameSpellChecker.suggest("Mocha.js")).to.include("Mocha");

    it("should be no duplicates", () => {
      const suggests = nameSpellChecker.suggest("vue");
      expect(suggests.length).to.be.equal([...new Set(suggests)].length);
    });
  });

  it("correct", () => {
    expect(nameSpellChecker.correct("vue")).to.be.false;
    expect(nameSpellChecker.correct("react")).to.be.false;
    expect(nameSpellChecker.correct("anguler")).to.be.false;
    expect(nameSpellChecker.correct("query")).to.be.false;
    expect(nameSpellChecker.correct("Mocha.js")).to.be.false;
    expect(nameSpellChecker.correct("Vue.js")).to.be.true;
    expect(nameSpellChecker.correct("React")).to.be.true;
    expect(nameSpellChecker.correct("Angular")).to.be.true;
    expect(nameSpellChecker.correct("jQuery")).to.be.true;
    expect(nameSpellChecker.correct("Mocha")).to.be.true;
  });

  it("add", () => {
    expect(nameSpellChecker.add("name-spell-checker")).to.be.eq(
      nameSpellChecker
    );
    expect(nameSpellChecker.add("name-spell-checker")).to.be.eq(
      nameSpellChecker
    );

    expect(nameSpellChecker.suggest("NameSpellChecker")).to.be.eql([
      "name-spell-checker",
    ]);

    expect(nameSpellChecker.add("name-dic")).to.be.eq(nameSpellChecker);

    expect(nameSpellChecker.suggest("js-name-dic")).to.be.eql(["name-dic"]);
  });

  it("remove", () => {
    expect(nameSpellChecker.correct("name-spell-checker")).to.be.true;
    expect(nameSpellChecker.correct("name-dic")).to.be.true;

    expect(nameSpellChecker.remove("name-spell-checker")).to.be.eq(
      nameSpellChecker
    );
    expect(nameSpellChecker.remove("name-dic")).to.be.eq(nameSpellChecker);
    expect(nameSpellChecker.remove("name-dic")).to.be.eq(nameSpellChecker);

    expect(nameSpellChecker.correct("name-spell-checker")).to.be.false;
    expect(nameSpellChecker.correct("name-dic")).to.be.false;

    expect(nameSpellChecker.innerNameMap).to.not.have.keys([
      "namespellchecker",
      "namedic",
    ]);
  });

  it("dictionary", () => {
    expect(nameSpellChecker.dictionary("1\nfoo")).to.be.eq(nameSpellChecker);
    expect(nameSpellChecker.correct("foo")).to.be.true;
  });

  it("personal", () => {
    expect(nameSpellChecker.personal("1\n*bar")).to.be.eq(nameSpellChecker);
    expect(nameSpellChecker.correct("bar")).to.be.false;
  });
});
