package app.entry;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;
import java.text.SimpleDateFormat;

public class EntrySerializer extends StdSerializer<Entry> {

    public EntrySerializer() {
        this(null);
    }

    public EntrySerializer(Class<Entry> e) {
        super(e);
    }

    @Override
    public void serialize(Entry entry, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm");
        jsonGenerator.writeStartObject();
        jsonGenerator.writeNumberField("id", entry.getId());
        jsonGenerator.writeNumberField("weight", entry.getWeight());
        jsonGenerator.writeStringField("date", format.format(entry.getDate()));
        jsonGenerator.writeStringField("note", entry.getNote());
        jsonGenerator.writeObjectFieldStart("skinfold");
        jsonGenerator.writeObjectField("biceps", entry.getSkinfoldBiceps());
        jsonGenerator.writeObjectField("triceps", entry.getSkinfoldTriceps());
        jsonGenerator.writeObjectField("abdominal", entry.getSkinfoldAbdominal());
        jsonGenerator.writeObjectField("chest", entry.getSkinfoldChest());
        jsonGenerator.writeObjectField("thigh", entry.getSkinfoldThigh());
        jsonGenerator.writeObjectField("calf", entry.getSkinfoldCalf());
        jsonGenerator.writeEndObject();
        jsonGenerator.writeObjectFieldStart("circumference");
        jsonGenerator.writeObjectField("arm", entry.getCircumferenceArm());
        jsonGenerator.writeObjectField("leg", entry.getCircumferenceLeg());
        jsonGenerator.writeObjectField("chest", entry.getCircumferenceChest());
        jsonGenerator.writeObjectField("calf", entry.getCircumferenceCalf());
        jsonGenerator.writeObjectField("neck", entry.getCircumferenceNeck());
        jsonGenerator.writeObjectField("waist", entry.getCircumferenceWaist());
        jsonGenerator.writeEndObject();
        jsonGenerator.writeEndObject();
    }
}
