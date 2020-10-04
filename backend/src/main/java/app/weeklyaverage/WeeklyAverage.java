package app.weeklyaverage;

import javax.persistence.*;
import java.io.Serializable;

//    Year and week compose the composite primary key
class WeeklyAverageId implements Serializable {

    private short year;
    private byte week;

    public WeeklyAverageId(){}

    public WeeklyAverageId(short year, byte week) {
        this.year = year;
        this.week = week;
    }

}

@Entity(name="weekly_average")
@IdClass(WeeklyAverageId.class)
@Table(name="weekly_average")
public class WeeklyAverage {

    public WeeklyAverage(){}
    public WeeklyAverage(short year, byte week, float weight) {
        super();
        this.year = year;
        this.week = week;
        this.weight = weight;
    }

    @Id
    @Column(name="\"year\"", nullable = false)
    private short year;

    @Id
    @Column(name="\"week\"", nullable = false)
    private byte week;

    @Column(name="\"weight\"", nullable = false)
    private float weight;

    public short getYear() {
        return year;
    }

    public void setYear(short year) {
        this.year = year;
    }

    public byte getWeek() {
        return week;
    }

    public void setWeek(byte week) {
        this.week = week;
    }

    public float getWeight() {
        return weight;
    }

    public void setWeight(float weight) {
        this.weight = weight;
    }
}
