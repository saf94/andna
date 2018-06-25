const { generateGoogleSlideRequest } = require("../quickstart");

const profile = {
  _id: "5b2cb2d71dd54008872688a3",
  name: "Saf",
  role: "front end dev",
  linkedin: "linkedin.com/saf",
  summary: "Im a guy",
  experience: [
    {
      titleLocation: "dev , number 1 best place",
      roleSummary: "i did some stuff it was good"
    },
    { titleLocation: "other dev , some places", roleSummary: null },
    { titleLocation: "scrum master , i cant remember", roleSummary: null }
  ],
  skills: "React, Java",
  tools: "Scrum, Wireframes"
};

const request = [
  {
    replaceAllText: {
      containsText: { text: "{titleLocation0}", matchCase: true },
      replaceText: "dev , number 1 best place"
    }
  },
  {
    replaceAllText: {
      containsText: { text: "{summary0}", matchCase: true },
      replaceText: "i did some stuff it was good"
    }
  },
  {
    replaceAllText: {
      containsText: { text: "{titleLocation1}", matchCase: true },
      replaceText: "other dev , some places"
    }
  },
  {
    replaceAllText: {
      containsText: { text: "{summary1}", matchCase: true },
      replaceText: null
    }
  },
  {
    replaceAllText: {
      containsText: { text: "{titleLocation2}", matchCase: true },
      replaceText: "scrum master , i cant remember"
    }
  },
  {
    replaceAllText: {
      containsText: { text: "{summary2}", matchCase: true },
      replaceText: null
    }
  },
  {
    replaceAllText: {
      containsText: { text: "{name}", matchCase: true },
      replaceText: "Saf"
    }
  },
  {
    replaceAllText: {
      containsText: { text: "{role}", matchCase: true },
      replaceText: "front end dev"
    }
  },
  {
    replaceAllText: {
      containsText: { text: "{linkedin}", matchCase: true },
      replaceText: "linkedin.com/saf"
    }
  },
  {
    replaceAllText: {
      containsText: { text: "{summary}", matchCase: true },
      replaceText: "Im a guy"
    }
  }
];

test("test google slide request generation from profiles", () => {
  expect(generateGoogleSlideRequest(profile)).toEqual(request);
});
