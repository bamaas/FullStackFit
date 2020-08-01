package app.log;

import javax.persistence.*;

@Entity
public class Log {

    public Log(){

    }

    public Log(long id, int weight) {
        super();
        this.id = id;
        this.weight = weight;
    }

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="\"id\"",unique=true,nullable=false)
    private long id;
    private int weight;

    public int getWeight() {
        return weight;
    }

    public void setWeight(int weight) {
        this.weight = weight;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }
}
