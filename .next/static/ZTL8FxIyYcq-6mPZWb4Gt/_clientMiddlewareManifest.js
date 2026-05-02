self.__MIDDLEWARE_MATCHERS = [
  {
    "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/api\\/ai(?:\\/((?:[^\\/#\\?]+?)(?:\\/(?:[^\\/#\\?]+?))*))?(\\\\.json)?[\\/#\\?]?$",
    "originalSource": "/api/ai/:path*"
  },
  {
    "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/profile(\\\\.json)?[\\/#\\?]?$",
    "originalSource": "/profile"
  },
  {
    "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/diagnosis(\\\\.json)?[\\/#\\?]?$",
    "originalSource": "/diagnosis"
  },
  {
    "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/translation(\\\\.json)?[\\/#\\?]?$",
    "originalSource": "/translation"
  },
  {
    "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/job(\\\\.json)?[\\/#\\?]?$",
    "originalSource": "/job"
  },
  {
    "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/match(\\\\.json)?[\\/#\\?]?$",
    "originalSource": "/match"
  },
  {
    "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/resume(\\\\.json)?[\\/#\\?]?$",
    "originalSource": "/resume"
  },
  {
    "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/interview(\\\\.json)?[\\/#\\?]?$",
    "originalSource": "/interview"
  },
  {
    "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/plan(\\\\.json)?[\\/#\\?]?$",
    "originalSource": "/plan"
  },
  {
    "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/report(\\\\.json)?[\\/#\\?]?$",
    "originalSource": "/report"
  },
  {
    "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/settings(\\\\.json)?[\\/#\\?]?$",
    "originalSource": "/settings"
  },
  {
    "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/login(\\\\.json)?[\\/#\\?]?$",
    "originalSource": "/login"
  },
  {
    "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/register(\\\\.json)?[\\/#\\?]?$",
    "originalSource": "/register"
  }
];self.__MIDDLEWARE_MATCHERS_CB && self.__MIDDLEWARE_MATCHERS_CB()