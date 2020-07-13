package app.utilities;

import com.google.common.base.Splitter;

import java.util.Map;

class Utils{
    public static Map<String, String> convertStringToMap(String mapAsString){
        return Splitter.on(",").withKeyValueSeparator("=").split(mapAsString);
    }
}
