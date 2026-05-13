#!/usr/bin/env python3
"""Add emoji field to every entry in toeic_wordlist.json"""
import json, pathlib

# id -> emoji  (300 entries)
EMOJI_MAP = {
    1:  "🎁",   # provide
    2:  "📋",   # require
    3:  "📅",   # schedule
    4:  "✅",   # available
    5:  "📈",   # increase
    6:  "📉",   # decrease
    7:  "📬",   # receive
    8:  "🔍",   # confirm
    9:  "📞",   # contact
    10: "👥",   # meeting
    11: "⏰",   # deadline
    12: "✔️",   # complete
    13: "📦",   # order
    14: "🧾",   # invoice
    15: "💰",   # budget
    16: "🚚",   # deliver
    17: "📊",   # report
    18: "📤",   # submit
    19: "👍",   # approve
    20: "❌",   # cancel
    21: "🙋",   # customer
    22: "📦",   # product
    23: "🛠️",  # service
    24: "💲",   # price
    25: "💳",   # payment
    26: "📢",   # announce
    27: "🙋‍♂️", # attend
    28: "🎤",   # present
    29: "🤝",   # hire
    30: "🏖️",  # retire
    31: "🌟",   # promote
    32: "🤝",   # negotiate
    33: "💬",   # discuss
    34: "✈️",   # travel
    35: "👨‍💼", # staff
    36: "👔",   # manager
    37: "💼",   # position
    38: "📝",   # apply
    39: "🎙️",  # interview
    40: "📋",   # register
    41: "🏨",   # accommodate
    42: "🏆",   # acquire
    43: "⚖️",   # adequate
    44: "🗂️",  # allocate
    45: "🔀",   # alternative
    46: "🔬",   # analyze
    47: "🔮",   # anticipate
    48: "〜",   # approximately
    49: "📊",   # assess
    50: "📌",   # assign
    51: "🤔",   # assume
    52: "🔑",   # authorize
    53: "📦",   # capacity
    54: "🤝",   # collaborate
    55: "💪",   # commitment
    56: "💰",   # compensate
    57: "🏆",   # competitive
    58: "✅",   # comply
    59: "🎼",   # conduct
    60: "🔢",   # consecutive
    61: "📜",   # contract
    62: "🤲",   # contribute
    63: "🗺️",  # coordinate
    64: "🎯",   # determine
    65: "📤",   # distribute
    66: "⚡",   # efficient
    67: "🚫",   # eliminate
    68: "⭐",   # emphasize
    69: "🏛️",  # establish
    70: "📊",   # evaluate
    71: "🌐",   # expand
    72: "⏳",   # expire
    73: "🚪",   # facilitate
    74: "⚙️",   # generate
    75: "🔧",   # implement
    76: "👉",   # indicate
    77: "🚀",   # initiative
    78: "❓",   # inquire
    79: "🔍",   # inspection
    80: "🏭",   # inventory
    81: "🔧",   # maintain
    82: "⬆️",   # maximize
    83: "⬇️",   # minimize
    84: "👁️",   # monitor
    85: "🎯",   # obtain
    86: "⚙️",   # operate
    87: "🗂️",  # organize
    88: "⏩",   # postpone
    89: "📋",   # prepare
    90: "🥇",   # priority
    91: "📋",   # procedure
    92: "📈",   # productivity
    93: "💡",   # proposal
    94: "💰",   # reimbursement
    95: "🔄",   # renew
    96: "🔄",   # replace
    97: "🗣️",  # represent
    98: "✅",   # resolve
    99: "💹",   # revenue
    100: "♟️",  # strategy
    101: "✅",  # sufficient
    102: "👌",  # suitable
    103: "👀",  # supervise
    104: "📦",  # supply
    105: "🔄",  # transfer
    106: "🔄",  # update
    107: "🚨",  # urgent
    108: "✔️",  # verify
    109: "👷",  # workforce
    110: "✉️",  # correspond
    111: "🎭",  # demonstrate
    112: "🛑",  # discontinue
    113: "📝",  # draft
    114: "⏱️",  # duration
    115: "🏢",  # headquarters
    116: "🚀",  # launch
    117: "⚖️",  # liability
    118: "🏪",  # merchandise
    119: "🎯",  # objective
    120: "🌟",  # outstanding
    121: "💸",  # overhead
    122: "💰",  # payroll
    123: "📋",  # preliminary
    124: "📊",  # projection
    125: "🎓",  # qualified
    126: "📅",  # quarter
    127: "🔍",  # recruitment
    128: "📜",  # regulation
    129: "🏗️",  # renovation
    130: "🗓️",  # reservation
    131: "🎯",  # responsibility
    132: "🛒",  # retailer
    133: "⚠️",  # shortage
    134: "📐",  # specification
    135: "🔔",  # subscription
    136: "⏱️",  # temporary
    137: "🤝",  # vendor
    138: "🛡️",  # warranty
    139: "📋",  # agenda
    140: "📝",  # amendment
    141: "📊",  # benchmark
    142: "👥",  # delegate
    143: "📮",  # dispatch
    144: "🔧",  # installation
    145: "🗣️",  # negotiate (2nd)
    146: "🌐",  # outsource
    147: "💴",  # reimburse
    148: "⚡",  # streamline
    149: "🏢",  # subsidiary
    150: "🔄",  # turnover
    151: "🔗",  # adjacent
    152: "🗂️",  # administer
    153: "⛈️",  # adverse
    154: "🔢",  # aggregate
    155: "⚖️",  # arbitration
    156: "🔍",  # audit
    157: "🤖",  # autonomous
    158: "🎯",  # calibrate
    159: "🔀",  # circumvent
    160: "📜",  # clause
    161: "🧩",  # coherent
    162: "📚",  # comprehensive
    163: "✂️",  # concise
    164: "🔒",  # confidential
    165: "🤝",  # consensus
    166: "🔗",  # consolidate
    167: "⚠️",  # contingency
    168: "🤝",  # counterpart
    169: "📈",  # cumulative
    170: "⚠️",  # deficiency
    171: "📉",  # depreciate
    172: "🔀",  # differentiate
    173: "💪",  # diligent
    174: "❗",  # discrepancy
    175: "🌈",  # diversify
    176: "✅",  # eligible
    177: "✍️",  # endorsement
    178: "🎟️",  # entitle
    179: "⚖️",  # equivalent
    180: "📊",  # fluctuation
    181: "🏪",  # franchise
    182: "🚨",  # fraud
    183: "🏔️",  # hierarchy
    184: "💭",  # implication
    185: "🎁",  # incentive
    186: "🏗️",  # infrastructure
    187: "💡",  # innovative
    188: "🛡️",  # integrity
    189: "⏱️",  # interim
    190: "📜",  # mandate
    191: "🔗",  # merger
    192: "🤝",  # mutual
    193: "📋",  # obligation
    194: "👁️",  # oversight
    195: "✍️",  # petition
    196: "🎯",  # proficient
    197: "🌟",  # prominent
    198: "🔮",  # prospective
    199: "💡",  # rationale
    200: "✅",  # reconcile
    201: "♻️",  # redundant
    202: "⭐",  # reputable
    203: "🔍",  # scrutiny
    204: "🎭",  # sophisticated
    205: "⚡",  # stimulate
    206: "🔒",  # stringent
    207: "💪",  # substantial
    208: "➕",  # surplus
    209: "♻️",  # sustainable
    210: "🤲",  # tangible
    211: "🚫",  # terminate
    212: "💳",  # transaction
    213: "🔎",  # transparency
    214: "⛏️",  # undermine
    215: "✅",  # validate
    216: "✅",  # viable
    217: "🛡️",  # vulnerable
    218: "✋",  # waive
    219: "💹",  # yield
    220: "🛒",  # procurement
    221: "🔒",  # proprietary
    222: "🤝",  # consortium
    223: "⚡",  # expedite
    224: "💪",  # leverage
    225: "🛡️",  # mitigation
    226: "⚖️",  # mediate
    227: "♾️",  # perpetual
    228: "📜",  # statutory
    229: "📈",  # accrue
    230: "⚖️",  # equity
    231: "💰",  # fiscal
    232: "🏛️",  # governance
    233: "🛡️",  # indemnify
    234: "⚖️",  # jurisdiction
    235: "💧",  # liquidate
    236: "🔍",  # niche
    237: "💡",  # paradigm
    238: "📁",  # portfolio
    239: "📈",  # scalable
    240: "✨",  # synergy
    241: "🔄",  # turnaround
    242: "⚙️",  # utilization
    243: "💼",  # workload
    244: "⚖️",  # offset
    245: "🤝",  # retention
    246: "🏆",  # acquisition
    247: "📜",  # compliance
    248: "🌈",  # diversification
    249: "✅",  # feasibility
    250: "🎁",  # incentivize
    251: "💔",  # insolvency
    252: "🔗",  # integration
    253: "💰",  # monetize
    254: "📚",  # precedent
    255: "🔄",  # recourse
    256: "👥",  # stakeholder
    257: "📈",  # trajectory
    258: "🔗",  # succession
    259: "🔧",  # retrofit
    260: "💰",  # upfront
    261: "🏆",  # vested
    262: "🛡️",  # hedging
    263: "💧",  # liquidation
    264: "🌐",  # outsourcing
    265: "🔍",  # due diligence
    266: "💹",  # revenue stream
    267: "📅",  # forthcoming
    268: "📍",  # proximity
    269: "💬",  # assertion
    270: "👤",  # incumbent
    271: "🙏",  # appreciation
    272: "🔥",  # controversy
    273: "🧩",  # coherent (2nd)
    274: "💴",  # reimbursement (2nd)
    275: "🏬",  # franchise (2nd)
    276: "📊",  # aggregate (2nd)
    277: "📅",  # interim (2nd)
    278: "🔢",  # cumulative (2nd)
    279: "🤲",  # mutual (2nd)
    280: "💡",  # viable (2nd)
    281: "🔄",  # redundant (2nd)
    282: "⛓️",  # stringent (2nd)
    283: "🗂️",  # contingency (2nd)
    284: "📏",  # benchmark (2nd)
    285: "🏋️",  # leverage (2nd)
    286: "🧊",  # capacity (2nd)
    287: "🏷️",  # overhead (2nd)
    288: "🌠",  # outstanding (2nd)
    289: "🔭",  # projection (2nd)
    290: "📋",  # mandate (2nd)
    291: "💎",  # transparency (2nd)
    292: "💎",  # integrity (2nd)
    293: "👑",  # succession (2nd)
    294: "👍",  # endorsement (2nd)
    295: "📊",  # fiscal (2nd)
    296: "🌱",  # sustainable (2nd)
    297: "🔄",  # paradigm shift
    298: "📋",  # due diligence (2nd)
    299: "⚡",  # conflict of interest
    300: "💰",  # bottom line
}

def main():
    path = pathlib.Path(__file__).parent.parent / "data" / "toeic_wordlist.json"
    data = json.loads(path.read_text(encoding="utf-8"))

    missing = []
    for entry in data:
        eid = entry["id"]
        emoji = EMOJI_MAP.get(eid)
        if emoji:
            entry["emoji"] = emoji
        else:
            missing.append(eid)

    if missing:
        print(f"⚠️  Missing emoji for IDs: {missing}")

    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"✅  Updated {len(data)} entries → {path}")

if __name__ == "__main__":
    main()
