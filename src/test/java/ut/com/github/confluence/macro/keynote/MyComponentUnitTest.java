package ut.com.github.confluence.macro.keynote;

import org.junit.Test;
import com.github.confluence.macro.keynote.api.MyPluginComponent;
import com.github.confluence.macro.keynote.impl.MyPluginComponentImpl;

import static org.junit.Assert.assertEquals;

public class MyComponentUnitTest
{
    @Test
    public void testMyName()
    {
        MyPluginComponent component = new MyPluginComponentImpl(null);
        assertEquals("names do not match!", "myComponent",component.getName());
    }
}