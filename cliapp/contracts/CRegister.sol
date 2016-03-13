// Contract register
contract CRegister {
    address creator;

    struct Cont {
        address addr;
        string abi;
        string source;
        uint date;
    }
    mapping (string => Cont) conts;
    string[] public list;

    function CRegister() {
        creator = msg.sender;
    }

    function add(string name, address addr, string abi, string source) {
        bytes memory bname = bytes(name);
        if (bname.length==0) throw;
        if (addr == address(0)) throw;
        if (conts[name].addr == address(0)) {
            list.push(name);
        }
        conts[name] = Cont(addr, abi, source, now);

    }
    function get(string name) constant returns (address addr, string abi) {
        addr = conts[name].addr;
        abi = conts[name].abi;
    }
    // function getContractName() constant returns
    function getCount() constant returns (uint) {
        return list.length;
    }

    function getSource(string name) constant returns (string) {
        return conts[name].source;
    }
    function _getIndex(string name) internal constant returns (int index) {
        int ret = -1;
        for (var i=0; i<list.length; i++) {
            if (_equal(list[i], name)) {
                ret = i;
            }
        }
    }
    function remove(string name) {
        var idx = _getIndex(name);
        if (idx < 0) return;
        for (var i=uint(idx); i<list.length - 1; i++) {
            list[i] = list[i+1];
        }
        list.length -= 1;
        delete conts[name];
    }

    function kill() {
        if (msg.sender == creator) {
            suicide(creator);  // kills this contract and sends remaining funds back to creator
        }
    }
    function _compare(string _a, string _b) internal constant returns (int) {
        bytes memory a = bytes(_a);
        bytes memory b = bytes(_b);
        uint minLength = a.length;
        if (b.length < minLength) minLength = b.length;
        //@todo unroll the loop into increments of 32 and do full 32 byte comparisons
        for (uint i = 0; i < minLength; i ++)
            if (a[i] < b[i])
                return -1;
            else if (a[i] > b[i])
                return 1;
        if (a.length < b.length)
            return -1;
        else if (a.length > b.length)
            return 1;
        else
            return 0;
    }
    /// @dev Compares two strings and returns true iff they are equal.
    function _equal(string _a, string _b) internal constant returns (bool) {
        return _compare(_a, _b) == 0;
    }
}